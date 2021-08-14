import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  usuarios: string[] | unknown = [];

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then(usuarios =>{
      console.log(usuarios);
      this.usuarios = usuarios
    });

    // this.getUsuarios();

    // const promesa = new Promise((resolve, reject) => {
      
    //   if (false) {
    //     resolve('Hola Mundo');
    //   } else {
    //     reject('Algo salio mal');
    //   }

    // });

    // promesa.then((mensaje) => {
    //   console.log(mensaje);
    // })
    // .catch(error => console.log('Error en mi promesa', error));

    // console.log('Fin del init');


  }

  // Another way, no need for contant and can return directly the promise

  getUsuarios(){
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data))
    });
  }

  // Another way of doing it, creando una constante y retornando una promesa
  //
  // getUsuarios(){
  //   const promesa = new Promise(resolve => {
  //     fetch('https://reqres.in/api/users')
  //       .then(resp => resp.json())
  //       .then(body => resolve(body.data))
  //   });

  //   return promesa;
  // }



  // A way of doing it, kinda dirty and messy
  //
  // getUsuarios(){
  //   fetch('https://reqres.in/api/users')
  //     .then(resp => {
  //       resp.json().then( body => console.log(body));
  //     })
  // }

}
