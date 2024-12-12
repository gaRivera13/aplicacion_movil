import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { LanguageComponent } from "../../components/language/language.component";
import { TranslateModule} from '@ngx-translate/core';
import { showToast, showAlert } from 'src/app/tools/message-routines';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [TranslateModule ,IonInput, CommonModule, FormsModule, RouterLink, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LanguageComponent]
})

export class CorreoPage  {
  public correo: string = '';
  public password: string = '';

  constructor(private router: Router, private authService: AuthService) {
    addIcons({refreshOutline});
  }
  
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  public async recuperarContrasena(form: NgForm): Promise<void> {
    if (form.invalid) {
      showToast('Por favor, ingrese un correo electrónico válido.');
      return;
    }
  
    const usuarioEncontrado = await this.authService.buscarUsuarioPorCorreo(this.correo);
    if (!usuarioEncontrado) {
      // Redirección a la página de error si el correo no es válido
      this.router.navigate(['/incorrecto']);
    } else {
      // Redirección a la página de la pregunta secreta si el correo es válido
      this.router.navigate(['/pregunta'], { queryParams: { correo: this.correo } });
    }
  }
  

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  

}
