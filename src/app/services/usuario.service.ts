import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { catchError, delay, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

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

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
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

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token',token);
    localStorage.setItem('menu',JSON.stringify(menu));
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

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

        this.guardarLocalStorage(resp.token,resp.menu);
        // localStorage.setItem('token',resp.token);
        // localStorage.setItem('menu',resp.menu);
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  crearUsuario (formData: RegisterForm){
    return this._http.post(`${base_url}/usuarios`,formData)
        .pipe(
          tap((resp: any) => {
            this.guardarLocalStorage(resp.token,resp.menu);
          })
        )
  }

  actualizarPerfil( data: {email: string, nombre: string, role: string} ){

    data = {
      ...data,
      role: this.usuario.role || ''
    }

    return this._http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm){
    return this._http.post(`${base_url}/login`,formData)
        .pipe(
          tap((resp: any) => {
            this.guardarLocalStorage(resp.token,resp.menu);
          })
        )
  }

  loginGoogle(token: any){
    return this._http.post(`${base_url}/login/google`,{token})
        .pipe(
          tap((resp: any) => {
            this.guardarLocalStorage(resp.token,resp.menu);
          })
        )
  }

  cargarUsuarios(desde: number = 0){
    // Change the HTTP Get Request to include a referer from Google to avoid 403. That’s an error - Rate-limit exceeded That’s all we know  ----- When loading several images from Google's CDN
    const url = `${base_url}/usuarios?desde=${desde}`
    // return this._http.get<{total: Number, usuarios: Usuario[]}>(url, this.headers); // Se puede hacer asi para asignar dos valores devueltos y que al desestructurar la response de cargarUsuarios en el usuarios.component no me marque error.
    return this._http.get<CargarUsuario>(url, this.headers)
        .pipe(
          delay(100),
          map(resp => {
            const usuarios = resp.usuarios.map(
              user => new Usuario(user.nombre, user.email,'', user.img, user.google, user.role, user.uid)
            );

            return {
              total: resp.total,
              usuarios
            }
          })
        )
  }

  eliminarUsuario(uid: string) {
    return this._http.delete(`${base_url}/usuarios/${uid}`, this.headers);
  }

  guardarUsuario( usuario: Usuario ){
    return this._http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
