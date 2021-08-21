import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  formSubmitted = false;
  auth2: any;

  loginForm = this._fB.group({
    email: [ localStorage.getItem('email') || '', [Validators.required,Validators.pattern(this.emailPattern)]],
    password: ['', Validators.required],
    remember: [(localStorage.getItem('email')) ? true : false]
  });

  constructor(private _router: Router,
              private _fB: FormBuilder,
              private _uS: UsuarioService,
              private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(){
    this._uS.login(this.loginForm.value)
        .subscribe((resp) => {
          if (this.loginForm.get('remember')?.value){
            localStorage.setItem('email',this.loginForm.get('email')?.value)
          } else {
            localStorage.removeItem('email')
          };

          // Navegar al dashboard
          this._router.navigateByUrl('/dashboard')
        },(err) => {
          Swal.fire('Error', err.error.msg, 'error')
        });
  }

  // No sirve, para volver a tener la referencia al onFailure o onSuccess. De la forma en la que lo hace google, el callback se pierde (?)
  // 
  // onSuccess(googleUser: any) {
  //   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  //   console.log(id_token)
  // }

  // onFailure(error: any) {
  //   console.log(error);
  // }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      // 'onsuccess': this.onSuccess,
      // 'onfailure': this.onFailure
    });

    this.startApp();
  }

  async startApp() {
    await this._uS.googleInit();
    this.auth2 = this._uS.auth2;

    this.attachSignin(document.getElementById('my-signin2')!);
  };

  attachSignin(element: HTMLElement) {
    this.auth2.attachClickHandler(element, {},
        (googleUser: any) => {
           const id_token = googleUser.getAuthResponse().id_token;
          //  console.log(id_token)
          this._uS.loginGoogle(id_token)
            .subscribe( resp => {
              //Navegar al dashboard
              this._ngZone.run(()=> {
                this._router.navigateByUrl('/dashboard')
              })
          });
        }, (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }
}
