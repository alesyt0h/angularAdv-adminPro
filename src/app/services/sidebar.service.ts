import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any = [];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu') || '');

    // if (this.menu.length === 0){
    //   // Redireccionar al login, porque el menu nunca deberia estar vacío
    // }
  }

  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard!!!',
  //     icono:  'mdi mdi-gauge',
  //     submenu: [
  //       {titulo: 'Main', url: '/' },
  //       {titulo: 'ProgressBar', url: 'progress' },
  //       {titulo: 'Gráficas', url: 'charts' },
  //       {titulo: 'Promesas', url: 'promesas' },
  //       {titulo: 'RxJS', url: 'rxjs' },
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono:  'mdi mdi-folder-lock-open',
  //     submenu: [
  //       {titulo: 'Usuarios', url: 'usuarios' },
  //       {titulo: 'Hospitales', url: 'hospitales' },
  //       {titulo: 'Médicos', url: 'medicos' }
  //     ]
  //   }
  // ]

}
