import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any

  constructor(private _http: HttpClient,
              private _router: Router,
              private _ngZone: NgZone) { 

    this.googleInit(); 
  }

  // This method has to be here to be able to logout, because logout is calling the instance created by gapi.load
  async googleInit(){
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '933819509453-1jkvt3k8b4qbacp65qg6lcqreqmjje5l.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve(this)
      });
    })
  }


  logout(){
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this._ngZone.run(()=> {
        this._router.navigateByUrl('/login')
      })
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    // Con esta validación nos ahorrariamos enviar un get que va a devolver error pues no hay token en la petición 
    //
    // if (token === ''){
    //   return of(false)
    // }

    return this._http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token',resp.token)
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  crearUsuario (formData: RegisterForm){
    return this._http.post(`${base_url}/usuarios`,formData)
        .pipe(
          tap((resp: any) => {
            localStorage.setItem('token',resp.token)
          })
        )
  }

  login(formData: LoginForm){
    return this._http.post(`${base_url}/login`,formData)
        .pipe(
          tap((resp: any) => {
            localStorage.setItem('token',resp.token)
          })
        )
  }

  loginGoogle(token: any){
    return this._http.post(`${base_url}/login/google`,{token})
        .pipe(
          tap((resp: any) => {
            localStorage.setItem('token',resp.token)
          })
        )
  }
}
