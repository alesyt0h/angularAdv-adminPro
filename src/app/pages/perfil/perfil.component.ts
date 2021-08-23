import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [`
    .btn.disabled, .btn:disabled {
      cursor: auto;
    }
  `
  ]
})
export class PerfilComponent implements OnInit {

  public usuario: Usuario;
  public perfilForm!: FormGroup;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(private _formBuilder: FormBuilder,
              private _usuarioService: UsuarioService,
              private _fileUpload: FileUploadService) { 

    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this._formBuilder.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil(){
    console.log(this.perfilForm.value)
    this._usuarioService.actualizarPerfil(this.perfilForm.value)
        .subscribe(resp => {
          const { nombre, email } = this.perfilForm.value
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Perfil actualizado!', 'El perfil del usuario ha sido actualizado correctamente', 'success')
        }, (err) => {
          Swal.fire('Error',err.error.msg,'error')
        });
  }

  cambiarImagen(file: File | any) {

    const thisFile = file.target.files[0];

    this.imagenSubir = thisFile

    if (!thisFile) { 
      return this.imgTemp = '';
    }

    const reader = new FileReader();
    reader.readAsDataURL(thisFile); // Devuelve la imagen en formato base64
    
    return reader.onloadend = () => {
      this.imgTemp = reader.result
    }
  }

  subirImagen(){
    this._fileUpload.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid!)
        .then(img => {
          this.usuario.img = img
          Swal.fire('Imagen subida!','La imagen se actualizo correctamente','success')
        }).catch( err => {
          console.log(err)
          Swal.fire('Error','No se pudo subir la imagen','error')
        })
  }

}
