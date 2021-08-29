import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private _uS: UsuarioService,
               private _router: Router){}


  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this._uS.validarToken()
        .pipe(
          tap(estaAutenticado => {
            if (!estaAutenticado){
              this._router.navigateByUrl('/login')
            }
          })
        )
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

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
