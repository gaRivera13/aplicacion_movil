import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject } from 'rxjs';
import { NivelEducacional } from '../model/nivel-educacional';
import { showAlertError } from '../tools/message-routines';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  userUpgrades = [
    {
      toVersion: 1,
      statements: [`
      CREATE TABLE IF NOT EXISTS USUARIO (
        cuenta TEXT PRIMARY KEY NOT NULL,
        correo TEXT NOT NULL,
        password TEXT NOT NULL,
        preguntaSecreta TEXT NOT NULL,
        respuestaSecreta TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        nivelEducacional INTEGER NOT NULL,
        fechaNacimiento TEXT NOT NULL,
        direccion TEXT NOT NULL
      );
      `]
    }
  ];

  sqlInsertUpdate = `
    INSERT OR REPLACE INTO USUARIO (
      cuenta, 
      correo, 
      password, 
      preguntaSecreta, 
      respuestaSecreta,
      nombre, 
      apellido,
      nivelEducacional, 
      fechaNacimiento,
      direccion
    ) VALUES (?,?,?,?,?,?,?,?,?,?);
  `;

  nombreBD = 'basedatos';
  db!: SQLiteDBConnection;
  listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  datosQR: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private sqliteService: SQLiteService) { }

  async inicializarBaseDeDatos() {
    await this.sqliteService.crearBaseDeDatos({database: this.nombreBD, upgrade: this.userUpgrades});
    this.db = await this.sqliteService.abrirBaseDeDatos(this.nombreBD, false, 'no-encryption', 1, false);
    await this.crearUsuariosDePrueba();
    await this.leerUsuarios();
  }

  async crearUsuariosDePrueba() {
    await this.guardarUsuario(Usuario.getNewUsuario(
      'admin', 
      'dolia@duocuc.cl', 
      '1234', 
      '¿Qué es lo que más amas?', 
      'El sufrimiento ajeno',
      'Administrador', 
      'del Sistema', 
      NivelEducacional.buscarNivelEducacional(6)!,
      new Date(2000, 0, 5),
      'Santiago, Las Condes'));

    await this.guardarUsuario(Usuario.getNewUsuario(
      'atorres', 
      'atorres@duocuc.cl', 
      '1234', 
      '¿Cuál es tu animal favorito?', 
      'gato',
      'Ana', 
      'Torres', 
      NivelEducacional.buscarNivelEducacional(6)!,
      new Date(2000, 0, 5),
      'Santiago centro'));
    await this.guardarUsuario(Usuario.getNewUsuario(
      'jperez', 
      'jperez@duocuc.cl', 
      '5678', 
      '¿Cuál es tu postre favorito?',
      'panqueques',
      'Juan', 
      'Pérez',
      NivelEducacional.buscarNivelEducacional(5)!,
      new Date(2000, 1, 10),
      'Santiago centro'));
    await this.guardarUsuario(Usuario.getNewUsuario(
      'cmujica', 
      'cmujica@duocuc.cl', 
      '0987', 
      '¿Cuál es tu vehículo favorito?',
      'moto',
      'Carla', 
      'Mujica', 
      NivelEducacional.buscarNivelEducacional(6)!,
      new Date(2000, 2, 20),
     'Santiago centro'));
  }

  // Create y Update del CRUD. La creación y actualización de un usuario
  // se realizarán con el mismo método, ya que la instrucción "INSERT OR REPLACE"
  // revisa la clave primaria y si el registro es nuevo entonces lo inserta,
  // pero si el registro ya existe, entonces los actualiza. Se debe tener cuidado de
  // no permitir que el usuario cambie su correo, pues dado que es la clave primaria
  // no debe poder ser cambiada.
  
  async guardarUsuario(usuario: Usuario): Promise<void> { 
    await this.db.run(this.sqlInsertUpdate, [usuario.cuenta, usuario.correo, usuario.password,
      usuario.preguntaSecreta, usuario.respuestaSecreta, usuario.nombre, usuario.apellido,
      usuario.nivelEducacional.id, convertDateToString(usuario.fechaNacimiento!),
      usuario.direccion]);
    await this.leerUsuarios();
  } 

  // Cada vez que se ejecute leerUsuarios() la aplicación va a cargar los usuarios desde la base de datos,
  // y por medio de la instrucción "this.listaUsuarios.next(usuarios);" le va a notificar a todos los programas
  // que se subscribieron a la propiedad "listaUsuarios", que la tabla de usuarios se acaba de cargar. De esta
  // forma los programas subscritos a la variable listaUsuarios van a forzar la actualización de sus páginas HTML.

  // ReadAll del CRUD. Si existen registros entonces convierte los registros en una lista de usuarios
  // con la instrucción ".values as Usuario[];". Si la tabla no tiene registros devuelve null.
  async leerUsuarios(): Promise<void> {
    const filas = (await this.db.query('SELECT * FROM USUARIO;')).values;

    if (!filas) {
      return undefined
    }
    if (filas.length === 0) {
      return undefined
    }

    const usuarios: Usuario[] = [];
    if (filas!.length > 0){
      filas?.forEach(fila=>{
        const usuario = this.convertirFilaAUsuario(fila);
        usuarios.push(usuario);
      });
    } 

    this.listaUsuarios.next(usuarios);
  }

  convertirFecha(fechaString: string) {
    // Separamos el string por el delimitador "/"
    const partes = fechaString.split('/');
  
    // Verificamos que tenga el formato correcto
    if (partes.length !== 3) {
      throw new Error('El formato de fecha debe ser dd/mm/yyyy');
    }
  
    // Obtenemos el día, mes y año
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript empiezan desde 0
    const año = parseInt(partes[2], 10);
  
    // Creamos el objeto Date
    const fecha = new Date(año, mes, dia);
  
    // Verificamos que la fecha sea válida
    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha inválida');
    }
  
    return fecha;
  }
  

  // Read del CRUD
  async leerUsuario(cuenta: string): Promise<Usuario | undefined> {
    const filas= (await this.db.query(
      'SELECT * FROM USUARIO WHERE cuenta=?;', 
      [cuenta])).values;

    if (!filas) {
        return undefined
    }
    if (filas.length === 0) {
      return undefined
    }

    const usuarios: Usuario[] = [];
    if (filas!.length > 0){
      filas?.forEach(fila=>{
        const usuario = this.convertirFilaAUsuario(fila);
        usuarios.push(usuario);
      });
    } 

    return usuarios[0];
  }

  // Delete del CRUD
  async eliminarUsuarioUsandoCuenta(cuenta: string): Promise<void> {
    await this.db.run('DELETE FROM USUARIO WHERE cuenta=?', 
      [cuenta]);
    await this.leerUsuarios();
  }

  // Validar usuario
  async buscarUsuarioValido(cuenta: string, password: string): Promise<Usuario | undefined> {
    const filas = (await this.db.query(
      'SELECT * FROM USUARIO WHERE cuenta=? AND password=?;',
      [cuenta, password])).values;

    if (!filas) {
        return undefined
    }
    if (filas.length === 0) {
      return undefined
  }

    const usuarios: Usuario[] = [];
    if (filas!.length > 0){
      filas?.forEach(fila=>{
        const usuario = this.convertirFilaAUsuario(fila);
        usuarios.push(usuario);
      });
    } 

    return usuarios[0];
  }

  // Validar usuario
  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined> {
    const filas = (await this.db.query(
      'SELECT * FROM USUARIO WHERE cuenta=?;',
      [cuenta])).values;
    
    if (!filas) {
        return undefined
    }
    if (filas.length === 0) {
      return undefined
    }

    const usuarios: Usuario[] = [];
    if (filas!.length > 0){
      filas?.forEach(fila=>{
        const usuario = this.convertirFilaAUsuario(fila);
        usuarios.push(usuario);
      });
    } 

    return usuarios[0];
  }

  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    const filas = (await this.db.query(
      'SELECT * FROM USUARIO WHERE correo=?;',
      [correo])).values; 
    
    if (!filas) {
        return undefined
    }
    if (filas.length === 0) {
      return undefined
    }

    const usuarios: Usuario[] = [];
    if (filas!.length > 0){
      filas?.forEach(fila=>{
        const usuario = this.convertirFilaAUsuario(fila);
        usuarios.push(usuario);
      });
    } 

    return usuarios[0];
  }

  private convertirFilaAUsuario(fila: any): Usuario {
    try {
      const usuario = new Usuario();
      usuario.cuenta = fila.cuenta;
      usuario.correo = fila.correo;
      usuario.password = fila.password;
      usuario.preguntaSecreta = fila.preguntaSecreta;
      usuario.respuestaSecreta = fila.respuestaSecreta;
      usuario.nombre = fila.nombre;
      usuario.apellido = fila.apellido;
      usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(fila.nivelEducacional) || new NivelEducacional();
      usuario.fechaNacimiento = convertStringToDate(fila.fechaNacimiento);
      usuario.direccion = fila.direccion;
      return usuario;
    } catch (error: any) {
      showAlertError('DataBaseService.convertirFilaAUsuario', error);
      return new Usuario();
    }
  }

  async obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    const filas = (await this.db.query('SELECT * FROM USUARIO;')).values;
  
    if (!filas || filas.length === 0) {
      return [];  // Retorna un array vacío si no hay usuarios.
    }
  
    const usuarios: Usuario[] = filas.map(fila => this.convertirFilaAUsuario(fila));
    return usuarios;
  }

  async eliminarUsuario(usuario: Usuario): Promise<void> {
    try {
      // Usando db.run en lugar de executeSql
      const query = 'DELETE FROM USUARIO WHERE correo = ?';
      await this.db.run(query, [usuario.correo]); // Eliminar el usuario basado en el correo
      console.log('Usuario eliminado con éxito');
      await this.leerUsuarios(); // Opcional: Actualizar la lista de usuarios si es necesario
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw new Error('No se pudo eliminar el usuario');
    }
  }
  
  


}
