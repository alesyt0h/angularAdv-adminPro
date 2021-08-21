import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  formSubmitted = false;
  registerForm: FormGroup = this._fB.group({
    nombre: ['Alejandro', Validators.required],
    email: ['test100@gmail.com', [Validators.required,Validators.pattern(this.emailPattern)]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [true, Validators.required],
  },{
    validators: this.passwordsIguales('password','password2')
  });

  constructor( private _fB: FormBuilder,
               private _uS: UsuarioService,
               private _router: Router ) { }

  crearUsuario(){
    this.formSubmitted = true;
    // console.log(this.registerForm.value);
    // console.log(this.registerForm.controls.password2.errors);
    
    if (this.registerForm.invalid) {
      return;
    }

    // Realizar el posteo

    this._uS.crearUsuario(this.registerForm.value)
        .subscribe( resp => {
          // console.log(resp);
          // console.log('usuario creado');

          //Navegar al dashboard
          this._router.navigateByUrl('/dashboard')
        }, (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  campoNoValido(campo: string): boolean {
    return (this.registerForm.get(campo)?.invalid && this.formSubmitted) ? true : false;
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    return (pass1 !== pass2 && this.formSubmitted) ? true : false 
  }

  passwordsIguales(pass1Name: string, pass2Name: string ){
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control!.value === pass2Control!.value) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({noEsIgual: true})
      }
    }
  }

}
