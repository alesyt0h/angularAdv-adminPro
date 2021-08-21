import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _uS: UsuarioService,
               private _router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    return this._uS.validarToken()
        .pipe(
          tap(estaAutenticado => {
            if (!estaAutenticado){
              this._router.navigateByUrl('/login')
            }
          })
        )
  }
  
}
