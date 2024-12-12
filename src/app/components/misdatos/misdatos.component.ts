import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import { showAlertDUOC, showToast } from 'src/app/tools/message-routines';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { addIcons } from 'ionicons';
import { arrowDownCircle, trash } from 'ionicons/icons';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    TranslateModule    
        
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-CL'}
  ]
})
export class MisdatosComponent implements OnInit {
  
  usuario = new Usuario();
  repeticionPassword = '';
  nivelId = 1;
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();

  constructor(private authService: AuthService, private bd: DataBaseService) { 
    addIcons({ arrowDownCircle, trash });
  }
  
  ngOnInit() {
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      this.usuario = usuario ? usuario : new Usuario();
      this.repeticionPassword = usuario ? usuario.password : '';
      this.nivelId = usuario ? usuario.nivelEducacional.id : 1;
    });
  }

  // Método de validación para verificar que todos los campos estén llenos
  validarCampos(): boolean {
    if (!this.usuario.nombre || !this.usuario.apellido || !this.usuario.direccion ||
        !this.usuario.preguntaSecreta || !this.usuario.respuestaSecreta ||
        !this.usuario.password || !this.repeticionPassword || !this.usuario.fechaNacimiento ||
        !this.usuario.nivelEducacional) {
      showAlertDUOC('Por favor, complete todos los campos antes de actualizar el perfil.');
      return false;
    }

    if (this.usuario.password !== this.repeticionPassword) {
      showAlertDUOC('Las contraseñas no coinciden. Por favor, verifíquelas.');
      return false;
    }

    return true;
  }

  async actualizarPerfil(form: NgForm) {
    if (this.validarCampos()) {
      await this.bd.guardarUsuario(this.usuario);
      showToast('Perfil actualizado correctamente.');
    }
  }

  cambiarNivel($event: any) {
    this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(this.nivelId)!;
  }

  limpiarCampos() {
    this.usuario.nombre = '';
    this.usuario.apellido = '';
    this.usuario.direccion = '';
    this.usuario.preguntaSecreta = '';
    this.usuario.respuestaSecreta = '';
    this.usuario.password = '';
    this.repeticionPassword = '';
    this.usuario.fechaNacimiento = undefined;

  }
}
