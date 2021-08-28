import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private _usuarioService: UsuarioService,
               private _router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      // return (this._usuarioService.role === 'ADMIN_ROLE') ? true : false;

      if (this._usuarioService.role === 'ADMIN_ROLE') {
        return true;
      } else {
        this._router.navigateByUrl('/dashboard');
        return false;
      }
  }
  
}
