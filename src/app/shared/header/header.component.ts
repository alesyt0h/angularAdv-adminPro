import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

declare var $: any; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  // public imgUrl = '';
  public usuario: Usuario;

  constructor(private _uS: UsuarioService,
              private _router: Router) { 
    this.usuario = _uS.usuario;

    // this.imgUrl = _uS.usuario.imagenUrl;
  }

  logout(){
    this._uS.logout();
  }

  buscar(termino: string){
    if (termino.trim().length === 0 ) {
      return;
    }

    this._router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }

  focus(){
    setTimeout(() => { 
      document.getElementById("searchBar")?.focus()
    }, 200);
  }

  closeSearchBar(){
    // const parent = event.srcElement.parentNode;
    $(".app-search").toggle(200);
  }

}
