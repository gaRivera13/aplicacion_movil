import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, AnimationController, IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
  ]
})
export class HeaderComponent {
  @Output() headerClick = new EventEmitter<string>();
  
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  usuarioAutenticado: Usuario | null = null; // Variable para el usuario autenticado

  constructor(private navCtrl: NavController, private authService: AuthService,
              private router: Router, private alertController: AlertController,
              private animationController: AnimationController) { 
    addIcons({ logOutOutline, qrCodeOutline });

    // Cargar el usuario autenticado al inicializar
    this.authService.usuarioAutenticado.subscribe(usuario => {
      this.usuarioAutenticado = usuario;
    });
  }

  sendClickEvent(buttonName: string) {
    this.headerClick.emit(buttonName);
  }

  logout() {
    this.authService.logout();
  }

  public ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo('transform', 'translate(0%)', 'translate(100%)')
        .fromTo('opacity', 6, 0.2);
      animation.play();
    }
  }

  public async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para verificar si el usuario autenticado es 'admin'
  isAdmin(): boolean {
    return this.usuarioAutenticado?.cuenta === 'admin'; // Asegúrate de que 'cuenta' sea la propiedad correcta
  }
}