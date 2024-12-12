import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { colorWandOutline, personCircle } from 'ionicons/icons';
import { LanguageComponent } from "../../components/language/language.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [TranslateModule ,IonInput, CommonModule, FormsModule, RouterLink, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LanguageComponent]
})
export class IngresoPage {

  public cuenta: string = '';
  public password: string = '';

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ personCircle, colorWandOutline });
    // this.cuenta = 'atorres';
    // this.password = '1234';
  }
  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  ingresar() {
    this.authService.login(this.cuenta, this.password);
  }

  public ingresarPaginaValidarCorreo(): void{
    this.router.navigate(['/correo']);
  }

  public ingresarPaginaMiRuta(): void{
    this.router.navigate(['/miruta']);
  }


  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

}
