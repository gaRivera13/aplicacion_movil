import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonGrid, IonRow ,IonContent, IonHeader, IonTitle, IonToolbar,IonCol ,IonIcon ,IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [IonButton ,TranslateModule ,IonInput, CommonModule, FormsModule, RouterLink, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCardContent, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LanguageComponent]
})
export class IncorrectoPage {
  router: any;

  constructor() { }

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  navigateTheme() {
    this.router.navigate(['/theme']);
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

}
