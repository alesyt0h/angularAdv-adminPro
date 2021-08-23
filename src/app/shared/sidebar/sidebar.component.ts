import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public menuItems!: any[];
  public usuario: Usuario;

  constructor(private _sidebarService: SidebarService,
              private _uS: UsuarioService) { 

    this.menuItems = _sidebarService.menu;

    this.usuario = _uS.usuario;
    // this.imgUrl = this._uS.usuario.imagenUrl;
  }

  ngOnInit(): void {
  }

}
