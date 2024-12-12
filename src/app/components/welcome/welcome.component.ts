import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [TranslateModule]
})
export class WelcomeComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private auth: AuthService) { 
    this.auth.usuarioAutenticado.subscribe((usuario) => {
      console.log(usuario);
      if (usuario) {
        this.usuario = usuario;
      }
    });
    
  }

  ngOnInit() {}
  

}
