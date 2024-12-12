import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';
import { showAlertDUOC, showToast } from 'src/app/tools/message-routines';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { addIcons } from 'ionicons';
import { arrowDownCircle, trash } from 'ionicons/icons';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router'; // Import necesario para routerLink

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    TranslateModule,
    RouterModule // Se agrega aquí para habilitar routerLink
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' }
  ]
})
export class UsuariosComponent implements OnInit {

  // Variables básicas para el diseño inicial
  usuarios: Usuario[] = []; // Aquí se podrán mostrar los usuarios obtenidos de la base de datos

  constructor(private authService: AuthService, private bd: DataBaseService) { 
    addIcons({ arrowDownCircle, trash });
  }

  ngOnInit() {
    // Suscripción para manejar el usuario autenticado (si es necesario)
    this.authService.usuarioAutenticado.subscribe((usuario) => {
      if (usuario) {
        console.log('Usuario autenticado:', usuario);
      }
    });

    // Obtener los usuarios desde la base de datos al inicializar la página
    this.cargarUsuarios();
  }

  // Método para cargar todos los usuarios desde la base de datos
  async cargarUsuarios() {
    try {
      this.usuarios = await this.bd.obtenerTodosLosUsuarios();
      
      // Mover al usuario 'admin' al inicio de la lista
      this.usuarios.sort((a, b) => {
        if (a.cuenta === 'admin') return -1; // 'admin' va primero
        if (b.cuenta === 'admin') return 1;  // cualquier otro va después
        return 0; // mantener el orden original
      });
  
      console.log('Usuarios cargados:', this.usuarios);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      showToast('Error al cargar los usuarios');
    }
  }

  // Método de ejemplo para eliminar un usuario (si lo necesitas)
  async eliminarUsuario(usuario: Usuario) {
    try {
      // Llamar al método para eliminar el usuario
      await this.bd.eliminarUsuario(usuario); // Asumiendo que ya tienes este método implementado
      this.usuarios = this.usuarios.filter(u => u !== usuario); // Actualizar la lista de usuarios
      showToast('Usuario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      showAlertDUOC('Error , No se pudo eliminar el usuario');
    }
  }

}
