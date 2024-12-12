import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonItem, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonInput } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageComponent } from "../../components/language/language.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Usuario } from 'src/app/model/usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [TranslateModule ,IonInput, CommonModule, 
            FormsModule, RouterLink, IonButton, IonGrid, 
            IonRow, IonCol, IonIcon, IonLabel, IonItem, 
            IonCardHeader, IonCardContent, IonCard, 
            IonContent, IonHeader, IonTitle, IonToolbar, 
            CommonModule, FormsModule, LanguageComponent]
})
export class MiclaseComponent implements OnDestroy  {
  clase: any;
  private subscription: Subscription;

  constructor( private authService: AuthService) 
  { 
    this.subscription = this.authService.qrCodeData.subscribe((qr) =>{
      this.clase = qr? JSON.parse(qr): null;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 

}
