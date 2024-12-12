import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonCardSubtitle, IonTitle,IonToolbar,IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonInput, IonText, IonTextarea, IonButton, IonIcon, IonGrid, IonCol, IonRow, IonCardContent, IonTabButton } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { pencilOutline, save, trash, trashOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageComponent } from '../language/language.component';
import { Usuario } from 'src/app/model/usuario';
import { Publicacion } from 'src/app/model/publicacion';
import { APIClientService } from 'src/app/services/apiclient.service';
import { showAlert, showAlertDUOC, showToast } from 'src/app/tools/message-routines';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
  standalone: true,
  imports:[   TranslateModule, IonCardSubtitle, IonTitle, IonToolbar,CommonModule, FormsModule , IonTextarea, IonInput, IonContent, IonHeader, IonCard, IonCardHeader, IonCardTitle, IonCard,IonLabel,IonItem,IonIcon,IonButton,IonContent,IonHeader, IonGrid, IonRow, IonCol, IonCardContent]
})
export class ForoComponent implements OnInit {

  usuario= new Usuario();
  publicacion: Publicacion = new Publicacion();
  publicaciones: any; 
  private ultimoId: number = 15 + 1;

  constructor(private router: Router, private authService: AuthService, private api: APIClientService) {
    addIcons({save, trash, pencilOutline, trashOutline});
  }

  ngOnInit() {
    this.api.listaPublicaciones.subscribe((publicaciones) => {
      publicaciones.reverse(); // Ordenar de más nueva a más antigua
      this.publicaciones = publicaciones;
    });
    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuario = usuario? usuario : new Usuario();
    });
    this.limpiarPublicacion();
  }
  
  setPublicacion(id: string, correo: string, nombre: string, apellido: string, titulo: string, contenido: string) {
    this.publicacion.id= id;
    this.publicacion.correo= correo;
    this.publicacion.nombre= nombre;
    this.publicacion.apellido= apellido;
    this.publicacion.titulo= titulo;
    this.publicacion.contenido= contenido;
  }

  limpiarPublicacion(){
    this.setPublicacion('','','','','','');
    this.api.cargarPublicaciones(); 
  }

  guardarPublicacion() {
    if (this.publicacion.titulo.trim() === '') {
        showAlertDUOC('Antes de hacer una publicación debe llenar el título.');
        return;
    }
    if (this.publicacion.contenido.trim() === '') {
        showAlertDUOC('Antes de hacer una publicación debe llenar el contenido.');
        return;
    }
    // Verifica si el ID ya existe, en cuyo caso actualiza; si no, crea
    if (this.publicacion.id && this.publicacion.id !== '') {
        this.actualizarPublicacion();
    } else {
        this.crearPublicacion();
    }
  }

  editarPublicacion(pub: any) {
    if (pub.correo !== this.usuario.correo) {
        showAlertDUOC('Solo puede editar las publicaciones a su nombre.');
        return;
    }
    // Asegúrate de que se establece el ID de la publicación
    this.setPublicacion(pub.id, pub.correo, pub.nombre, pub.apellido, pub.titulo, pub.contenido);
    this.topOfPage.nativeElement.scrollIntoView({block: 'end', behavior: 'smooth'});
  }

  mensajePublicacion(accion: string, id: Publicacion) {
    showAlertDUOC(`La publicación ${id} fue ${accion} correctamente`);
    this.limpiarPublicacion(); 
}


  crearPublicacion() {
    this.publicacion.id = (++this.ultimoId).toString(); // Genera un nuevo ID incremental
    this.publicacion.correo = this.usuario.correo;
    this.publicacion.nombre = this.usuario.nombre;
    this.publicacion.apellido = this.usuario.apellido;

    this.api.crearPublicacion(this.publicacion).subscribe({
      next: (publicacionCreada) => {
        this.mensajePublicacion('creada', publicacionCreada.id);
      },
      error: (error) => showToast('El servicio API Rest de Publicaciones no está disponible')
    });
  }

  actualizarPublicacion() {
    this.api.actualizarPublicacion(this.publicacion).subscribe({
      next: (publicacion) => this.mensajePublicacion('actualizada', publicacion.id),
      error: (error) => showToast('El servicio API Rest de Publicaciones no está disponible')
    });  
  }

  eliminarPublicacion(pub: any) {
    if (pub.correo !== this.usuario.correo) {
      showAlertDUOC('Solo puede eliminar las publicaciones a su nombre');
      return;
    }
    this.api.eliminarPublicacion(pub.id).subscribe({
      next: (publicacion) => this.mensajePublicacion('eliminada', publicacion.id),
      error: (error) => showToast('El servicio API Rest de Publicaciones no está disponible')
    }); 
  }

  @ViewChild('topOfPage') topOfPage!: ElementRef; 

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

}