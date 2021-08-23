import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  // public imgUrl = '';
  public usuario: Usuario;

  constructor(private _uS: UsuarioService) { 
    this.usuario = _uS.usuario;

    // this.imgUrl = _uS.usuario.imagenUrl;
  }

  logout(){
    this._uS.logout();
  }

}
