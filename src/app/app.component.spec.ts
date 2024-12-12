import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Usuario } from './model/usuario';
import { RouterTestingModule } from '@angular/router/testing';


describe('Probar el comienzo de la aplicación',() =>{

  beforeEach(async() =>{
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });
  it ('Se deberia crear la aplicacion',() =>{
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it ('Probar que el titulo de la App sea "Asistencia Duoc"',()=>{
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.titulo).toEqual('Asistencia Duoc');
  });
  
});

// prueba unitaria para la contraseña (descomentar despues)
describe('Probar clase de usuario', () => {

  let usuario: Usuario;

  beforeEach(() => {
    // Inicializamos un usuario para cada prueba
    usuario = new Usuario();  // Se asume que el constructor no requiere parámetros
    usuario.listaUsuarios = [
      new Usuario(),  // Usuario 1
    ];

    // Agregar detalles de los usuarios para prueba
    usuario.listaUsuarios[0].password = '1234';
    usuario.listaUsuarios[0].cuenta = 'atorres';
    usuario.listaUsuarios[0].correo = 'atorres@duocuc.cl';
    usuario.listaUsuarios[0].nombre = 'Ana';
    usuario.listaUsuarios[0].apellido = 'Torres';
    usuario.listaUsuarios[0].direccion = 'Santiago centro'
  });

  describe('Probar que la Contraseña sea correcta', () => {
    
    it('Probar que la contraseña no sea vacía', () => {
      usuario.listaUsuarios[0].password = ''; // Contraseña vacía
      expect(usuario.listaUsuarios[0].validarPassword()).toContain('Para entrar al sistema debe ingresar la contraseña.');
    });

    it('Probar que la contraseña sea numérica y no "abcd"', () => {
      usuario.listaUsuarios[0].password = 'abcd'; // Contraseña no numérica
      expect(usuario.listaUsuarios[0].validarPassword()).toContain('La contraseña debe ser numérica.');
    });

    it('Probar que la contraseña no supere los 4 dígitos como por ejemplo "1234567890"', () => {
      usuario.listaUsuarios[0].password = '1234567890'; // Contraseña de más de 4 dígitos
      expect(usuario.listaUsuarios[0].validarPassword()).toContain('La contraseña debe ser numérica de 4 dígitos.');
    });

    it('Probar que la contraseña sea de 4 dígitos como por ejemplo "1234"', () => {
      usuario.listaUsuarios[0].password = '1234'; // Contraseña válida de 4 dígitos
      expect(usuario.listaUsuarios[0].validarPassword()).toEqual('');
    });

  });

  describe('Probar que la Cuenta sea correcta',()=>{
    it('Probar que la cuenta no sea vacía', ()=>{
      usuario.listaUsuarios[0].cuenta = '';
      expect(usuario.listaUsuarios[0].validarCuenta()).toContain('Para entrar al sistema debe ingresar nombre de cuenta.');
    });

    it('Probar que la cuenta sea alfabetica y no "A12345"',()=>{
      usuario.listaUsuarios[0].cuenta = 'A12345';
      expect(usuario.listaUsuarios[0].validarCuenta()).toContain('La cuenta debe ser solo alfabética.');
    });

    it('Probar que la cuenta tenga menos de 10 caracteres como por ejemplo "atorres"',()=>{
      usuario.listaUsuarios[0].cuenta = 'atorres';
      expect(usuario.listaUsuarios[0].validarCuenta()).toEqual('');
    });
  });

  describe('Probar que el Correo sea correcto',()=>{
    it ('Probar que el correo no este vacío',()=>{
      usuario.listaUsuarios[0].correo ='';
      expect(usuario.listaUsuarios[0].validarCorreo()).toContain('Para ingresar al sistema debe ingresar un correo electrónico.');
    });
    it('Probar que el correo no sea invalido como por ejemplo "atorres@cl"',()=>{
      usuario.listaUsuarios[0].correo = "atorres@cl";
      expect(usuario.listaUsuarios[0].validarCorreo()).toContain('El correo electrónico no es válido.');
    });
    it('Probar que el correo sea valido como por ejemplo "atorres@duocuc.cl"',()=>{
      usuario.listaUsuarios[0].correo = "atorres@duocuc.cl";
      expect(usuario.listaUsuarios[0].validarCorreo()).toEqual('');
    });
  });

  describe('Probar que el Nombre sea correcto',()=>{
    it('Probar que el nombre no sea vacío',()=>{
      usuario.listaUsuarios[0].nombre= '';
      expect(usuario.listaUsuarios[0].validarNombre()).toContain('El nombre no puede estar vacío.');
    });
    it ('Probar que el nombre solo tenga letras como por ejemplo "Ana"',()=>{
      usuario.listaUsuarios[0].nombre = 'Ana';
      expect(usuario.listaUsuarios[0].validarNombre()).toEqual('');
    });
    it ('Probar que el nombre no pueda ser con menos de dos caracteres, como por ejemplo "A"',()=>{
      usuario.listaUsuarios[0].nombre = 'A';
      expect(usuario.listaUsuarios[0].validarNombre()).toContain('El nombre debe tener al menos 2 caracteres.');
    });
  });

  describe('Probar que el Apellido sea correcto',()=>{
    it ('Probar que el apellido no sea vacío',()=>{
      usuario.listaUsuarios[0].apellido='';
      expect(usuario.listaUsuarios[0].validarApellido()).toContain('El apellido no puede estar vacío.');
    });
    it ('Probar que el apellido no sea menor a 2 caracteres, como por ejemplo "T"',()=>{
      usuario.listaUsuarios[0].apellido='T';
      expect(usuario.listaUsuarios[0].validarApellido()).toContain('El apellido debe tener al menos 2 caracteneres.');
    });
    it ('Probar que el apellido solo tenga letras, como por ejemplo "Torres',()=>{
      usuario.listaUsuarios[0].apellido='Torres';
      expect(usuario.listaUsuarios[0].validarApellido()).toEqual('');
    });
  });

  describe('Probar que la Direccion sea correcta',()=>{
    it ('Probar que la dirección no sea vacío',()=>{
      usuario.listaUsuarios[0].direccion='';
      expect(usuario.listaUsuarios[0].validarDireccion()).toContain('La dirección no puede estar vacía.');
    });
    it ('Probar que la dirección no sea menor a 8 caracteres',()=>{
      usuario.listaUsuarios[0].direccion= 'Santia';
      expect(usuario.listaUsuarios[0].validarDireccion()).toContain('La dirección debe tener al menos 8 caracteres.');
    });
    it ('Probar que la dirección sea valida, como por ejemplo "Santiago Centro"',()=>{
      usuario.listaUsuarios[0].direccion= 'Santiago Centro';
      expect(usuario.listaUsuarios[0].validarDireccion()).toEqual('');
    });
  });
});