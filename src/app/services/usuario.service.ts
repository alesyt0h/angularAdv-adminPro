import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario

  constructor(private _http: HttpClient,
              private _router: Router,
              private _ngZone: NgZone) { 

    this.googleInit(); 
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
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

    // Con esta validación nos ahorrariamos enviar un get que va a devolver error pues no hay token en la petición 
    //
    // if (token === ''){
    //   return of(false)
    // }

    return this._http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      // Aveces !! Muy Excepcionalmente !! Se podria dar el caso de que el map se ejecutase antes que el tap, por eso en el video 15.5 Quito el map e hizo un return directamente despues del localStorage.setItem y cambio el tap por un map
      tap( (resp: any) => {
        console.log(resp);
        
        // Lo que se busca con esto: Al tener que validar el token siempre en una pagina con el guard que requiere validarToken(), al estar creando una nueva instancia de usuario tendria disponible este donde este los datos del usuario por que lo estoy asignando a this.usuario, desde cualquier lugar que import mi usuario.service tengo disponible la instancia de usuario. 
                                         //  img = ''
        const { email, google, nombre, role, img, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

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

  actualizarPerfil( data: {email: string, nombre: string, role: string} ){

    data = {
      ...data,
      role: this.usuario.role || ''
    }

    return this._http.put(`${base_url}/usuarios/${this.uid}`,data,{
      headers: {
        'x-token': this.token
      }
    });
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
