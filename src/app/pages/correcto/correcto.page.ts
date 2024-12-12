import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonGrid, IonRow ,IonContent, IonHeader, IonTitle, IonToolbar,IonCol ,IonIcon ,IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { showToast, showAlert } from 'src/app/tools/message-routines';


@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [IonButton ,TranslateModule ,IonInput, CommonModule, FormsModule, RouterLink, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LanguageComponent]
})
export class CorrectoPage {
  public password: string = '';
  public correo: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
 


  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  ngOnInit() {
    // Obtenemos el correo de los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      this.correo = params['correo']; // Asegúrate de que 'correo' esté siendo pasado como queryParam
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
      this.password = usuario.password;
    }
  }

  

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }


}
