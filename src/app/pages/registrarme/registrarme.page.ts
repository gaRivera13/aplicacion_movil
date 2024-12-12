import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { refreshOutline, person, mail, lockClosed, calendar } from 'ionicons/icons';
import { showToast, showAlert, showAlertDUOC } from 'src/app/tools/message-routines';
import { Usuario } from 'src/app/model/usuario';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Import IonicModule
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterLink,
    LanguageComponent,
    IonicModule,
    MatFormFieldModule,   // Importa el MatFormFieldModule
    MatInputModule,       // Importa el MatInputModule
    MatDatepickerModule,  // Importa el MatDatepickerModule
    MatNativeDateModule,   // Add IonicModule here to provide all necessary Ionic components
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-CL'}
  ]
  
})
export class RegistrarmePage {
  usuario = new Usuario();
  repeticionPassword = '';
  nivelId = 1;
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();

  constructor(private authService: AuthService, private bd: DataBaseService) {
    addIcons({ person, mail, lockClosed, calendar });
  }


  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  // Método de validación para verificar que todos los campos estén llenos
  validarCampos(): boolean {
    console.log(this.usuario);  // Verifica los valores de usuario
    if (!this.usuario.cuenta || !this.usuario.nombre || !this.usuario.apellido || !this.usuario.correo || !this.usuario.direccion ||
        !this.usuario.password || !this.repeticionPassword || !this.usuario.fechaNacimiento ||
        !this.usuario.nivelEducacional) {
      showAlertDUOC('Por favor, complete todos los campos para crear su perfil.');
      return false;
    }
  
    if (this.usuario.password !== this.repeticionPassword) {
      showAlertDUOC('Las contraseñas no coinciden. Por favor, verifíquelas.');
      return false;
    }
  
    return true;
  }
  
    

  async crearPerfil(form: NgForm) {
    if (this.validarCampos()) {
      await this.bd.guardarUsuario(this.usuario);
      showToast('Perfil creado correctamente.');
    }
  }

  cambiarNivel($event: any) {
    this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(this.nivelId)!;
  }
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA to the module
})
export class RegistrarmePageModule {}
