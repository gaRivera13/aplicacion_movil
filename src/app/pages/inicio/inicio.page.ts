import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonButton, IonIcon, IonSegment, IonFooter } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CodigoqrComponent } from "../../components/codigoqr/codigoqr.component";
import { MiclaseComponent } from "../../components/miclase/miclase.component";
import { ForoComponent } from "../../components/foro/foro.component";
import { LanguageComponent } from 'src/app/components/language/language.component';
import { addIcons } from 'ionicons';
import { gridOutline, homeOutline, pencilOutline, schoolOutline, qrCodeOutline, person, cameraOutline } from 'ionicons/icons';
import { MisdatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { Capacitor } from '@capacitor/core';
import { Asistencia } from 'src/app/model/asistencia';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { UsuariosComponent } from "../../components/usuarios/usuarios.component";
import { Usuario } from 'src/app/model/usuario'; // Asegúrate de que esta importación esté correcta

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    IonFooter, 
    IonSegment, 
    IonIcon, 
    IonButton, 
    IonSegmentButton, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    TranslateModule, 
    FormsModule,
    WelcomeComponent,
    HeaderComponent,
    FooterComponent, 
    CodigoqrComponent, 
    MiclaseComponent, 
    ForoComponent, 
    LanguageComponent, 
    MisdatosComponent, 
    UsuariosComponent
  ]
})
export class InicioPage {
  
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';
  usuarioAutenticado: Usuario | null = null; // Variable para el usuario autenticado

  constructor(private authService: AuthService, private scanner: ScannerService) { 
    addIcons({homeOutline,schoolOutline,cameraOutline,pencilOutline,gridOutline,person,qrCodeOutline});

    // Suscribirse al BehaviorSubject para obtener el usuario autenticado
    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuarioAutenticado = usuario;
    });
  }

  ionViewWillEnter() {
    this.changeComponent('welcome');
  }

  async headerClick(button: string) {
    if (button === 'scan' && Capacitor.getPlatform() === 'web') {
      if (!this.isAdmin()) { // Solo cambiar si el usuario no es admin
        this.selectedComponent = 'codigoqr';
      }
    } else if (button === 'scan' && Capacitor.getPlatform() !== 'web') {
      if (!this.isAdmin()) { // Solo escanear si el usuario no es admin
        this.mostrarAsistencia(await this.scanner.scan());
      }
    }
  }

  webQrScanned(qr: string) {
    this.mostrarAsistencia(qr);
  }

  webQrStopped() {
    this.mostrarAsistencia('welcome');
  }

  mostrarAsistencia(qr: string) {
    if (Asistencia.codigoQrValido(qr)) {
      this.authService.qrCodeData.next(qr);
      this.changeComponent('miclase');
      return;
    }
    this.changeComponent('welcome');
  }

  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }

  // Método para verificar si el usuario autenticado es 'admin'
  isAdmin(): boolean {
    return this.usuarioAutenticado?.cuenta === 'admin'; // Asegúrate de que 'cuenta' sea la propiedad correcta
  }

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
}