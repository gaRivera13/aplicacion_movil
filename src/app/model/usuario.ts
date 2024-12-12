import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";
import { Asistencia } from '../interfaces/asistencia';
import { DataBaseService } from '../services/data-base.service';
import { Optional } from '@angular/core';

export class Usuario extends Persona {

  public cuenta: string;
  public correo: string;
  public password: string;
  public preguntaSecreta: string;
  public respuestaSecreta: string;
  public asistencia: Asistencia;
  public listaUsuarios: Usuario[];
  public direccion: string;
  

  constructor(@Optional() private db?: DataBaseService) {
    super();
    this.cuenta = '';
    this.correo = '';
    this.password = '';
    this.preguntaSecreta = '';
    this.respuestaSecreta = '';
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    this.fechaNacimiento = undefined;
    this.asistencia = this.asistenciaVacia();
    this.listaUsuarios = [];
    this.direccion= '';
  }

  public asistenciaVacia(): Asistencia {
    return {  
      bloqueInicio: 0,
      bloqueTermino: 0,
      dia: '',
      horaFin: '',
      horaInicio: '',
      idAsignatura: '',
      nombreAsignatura: '',
      nombreProfesor: '',
      seccion: '',
      sede: ''
    };
  }

  public static getNewUsuario(
    cuenta: string,
    correo: string,
    password: string,
    preguntaSecreta: string,
    respuestaSecreta: string,
    nombre: string,
    apellido: string,
    nivelEducacional: NivelEducacional,
    fechaNacimiento: Date | undefined,
    direccion: string
  ) {
    let usuario = new Usuario();
    usuario.cuenta = cuenta;
    usuario.correo = correo;
    usuario.password = password;
    usuario.preguntaSecreta = preguntaSecreta;
    usuario.respuestaSecreta = respuestaSecreta;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.nivelEducacional = nivelEducacional;
    usuario.fechaNacimiento = fechaNacimiento;
    usuario.direccion = direccion;
    return usuario;
  }

  public validarPassword(): string {
    if (this.password.trim() === '') {
      return 'Para entrar al sistema debe ingresar la contraseña.';
    }
    for(let i = 0; i < this.password.length; i++) {
      if ('0123456789'.indexOf(this.password.charAt(i)) === -1) {
        return 'La contraseña debe ser numérica.';
      }
    }
    if (this.password.length !== 4) {
      return 'La contraseña debe ser numérica de 4 dígitos.';
    }
    return '';
  }

  public validarCuenta(): string {
    if (this.cuenta.trim() ===''){
      return 'Para entrar al sistema debe ingresar nombre de cuenta.';
    }
    if (!/^[a-zA-Z]+$/.test(this.cuenta)) {
      return 'La cuenta debe ser solo alfabética.';
    }
    if (this.cuenta.length > 10) {
      return 'La cuenta no puede tener más de 10 caracteres.';
    }
    return '';
  }

  public validarCorreo(): string {
    const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (this.correo.trim() === '') {

      return 'Para ingresar al sistema debe ingresar un correo electrónico.';
    }
    if (!correoRegex.test(this.correo)) {
      return 'El correo electrónico no es válido.';
    }
    return '';
  }

  public validarNombre(): string{
    if (this.nombre.trim()===''){
      return 'El nombre no puede estar vacío.';
    }
    if (!/^[a-zA-Z]{2,}$/.test(this.nombre)) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }
    return '';
  }

  public validarApellido(): string{
    if (this.apellido.trim()===''){
      return 'El apellido no puede estar vacío.';
    }
    if (!/^[a-zA-Z]{2,}$/.test(this.apellido)){
      return 'El apellido debe tener al menos 2 caracteneres.'
    }
    return '';
  }

  public validarDireccion(): string{
    if (this.direccion.trim()===''){
      return 'La dirección no puede estar vacía.';
    }
    if (this.direccion.length <= 8){
      return 'La dirección debe tener al menos 8 caracteres.';
    }
    
    return '';
  }

  public validarUsuario(): string {
    return this.validarCorreo()
      || this.validarPassword()
      || this.validarCuenta()
      || this.validarNombre()
      || this.validarApellido()
      || this.validarDireccion();
  }
  

  async buscarUsuarioValido(cuenta: string, password: string): Promise<Usuario | undefined> {
    return await this.db!.buscarUsuarioValido(cuenta, password);
  }

  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined>  {
    return await this.db!.buscarUsuarioPorCuenta(cuenta);
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    this.db!.guardarUsuario(usuario);
  }

  async eliminarUsuario(cuenta: string): Promise<void>  {
    this.db!.eliminarUsuarioUsandoCuenta(cuenta);
  }

  public override toString(): string {
    return `
      ${this.cuenta}
      ${this.correo}
      ${this.password}
      ${this.preguntaSecreta}
      ${this.respuestaSecreta}
      ${this.nombre}
      ${this.apellido}
      ${this.nivelEducacional.getEducacion()}
      ${this.getFechaNacimiento()}
      ${this.direccion}`;
  }


}