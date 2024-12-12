import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCardTitle,IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { Usuario } from 'src/app/model/usuario'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [IonCardTitle,IonText, TranslateModule, IonInput, CommonModule, FormsModule, RouterLink, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, LanguageComponent]
})
export class PreguntaPage {
  public nombre: string = '';
  public apellido: string = '';
  public pregunta: string = '';
  public respuestaInput: string = '';
  private correo: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  ngOnInit() {
    // Usar queryParams para obtener el correo
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo'];
      if (this.correo) {
        this.cargarDatosUsuario();
      } else {
        console.error('Correo no proporcionado');
      }
    });
  }

  async cargarDatosUsuario() {
    const usuario = await this.authService.buscarUsuarioPorCorreo(this.correo);

    if (usuario) {
      this.nombre = usuario.nombre;
      this.apellido = usuario.apellido;
      this.pregunta = usuario.preguntaSecreta;
      
    } else {
      console.error('Usuario no encontrado');
    }
  }

  async verificarRespuesta() {
    const usuario = await this.authService.buscarUsuarioPorCorreo(this.correo);

    if (usuario && this.respuestaInput === usuario.respuestaSecreta) {
      this.router.navigate(['/correcto'], { queryParams: { correo: this.correo } });
    } else {
      this.router.navigate(['/incorrecto']);
    }
    
  }
  

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  
}