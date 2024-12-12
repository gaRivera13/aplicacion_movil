import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gridOutline, homeOutline, pencilOutline, person, schoolOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario'; // Asegúrate de que esta importación esté correcta

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonFooter,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonIcon
  ]
})
export class FooterComponent {
  selectedButton = 'welcome';
  @Output() footerClick = new EventEmitter<string>();
  usuarioAutenticado: Usuario | null = null; // Variable para el usuario autenticado

  constructor(private authService: AuthService) {
    addIcons({ person, homeOutline, schoolOutline, pencilOutline, gridOutline });

    // Suscribirse al BehaviorSubject para obtener el usuario autenticado
    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuarioAutenticado = usuario;
    });
  }

  segmentedChange($event: any) {
    this.footerClick.emit(this.selectedButton);
  }

  // Método para verificar si el usuario autenticado es 'admin'
  isAdmin(): boolean {
    return this.usuarioAutenticado?.cuenta === 'admin';
  }
}