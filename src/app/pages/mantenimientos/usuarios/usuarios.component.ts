import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private _usuarioService: UsuarioService,
              private _busquedasService: BusquedasService,
              private _modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this._modalImagenService.nuevaImagen
        .pipe(delay(200))
        .subscribe(img => this.cargarUsuarios());
  }
  
  get myUid(){
    return this._usuarioService.uid;
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
        .subscribe( ({total, usuarios}) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
          // No queda bien pero lo dejo para referencia, no se actualiza bien por eso usamos usuariosTemp
          // 
          // if (usuarios.length !== 0) {
          //   this.usuarios = usuarios;
          // }
        });
  }

  cambiarPagina(valor: number){
    this.desde += valor;

    if (this.desde < 0){
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }

    this.cargarUsuarios();

  }

  buscar(termino: string) {
    if (termino.length === 0){
      this.usuarios = this.usuariosTemp;
      return;
    }
    this._busquedasService.buscar('usuarios',termino)
        .subscribe(resultados => {
          this.usuarios = resultados;
        })
  }

  eliminarUsuario(usuario: Usuario){

    if (usuario.uid === this._usuarioService.uid){
      Swal.fire('Error','No puedes borrarte a ti mismo!','error');
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}, está seguro? 👀`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.eliminarUsuario(usuario.uid!)
            .subscribe( resp => {
              Swal.fire(
                'Usuario borrado',
                `El usuario ${usuario.nombre} ha sido borrado`,
                'success'
              );
              this.cargarUsuarios();
            })
      }
    })
  }

  cambiarRole(usuario: Usuario) {
    this._usuarioService.guardarUsuario(usuario)
        .subscribe( resp => {
          console.log(resp);
        }, (err) => {
          Swal.fire('Error','No se pudo efectuar el cambio de Rol','error')
        })
  }

  abrirModal(usuario: Usuario){
    // console.log(usuario);
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE'){
      this._modalImagenService.abrirModal('usuarios',usuario.uid!,usuario.img);
    }
  }
}
