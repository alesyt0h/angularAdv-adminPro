import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  abrirModal(){
    // this.modalImagenService.abrirModal('usuarios',);
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id   = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir,tipo,id)
        .then(img => {
          // this.usuario.img = img
          Swal.fire('Imagen subida!','La imagen se actualizo correctamente','success');
          
          this.modalImagenService.nuevaImagen.emit(img);

          this.cerrarModal();
        }).catch( err => {
          console.log(err)
          Swal.fire('Error','No se pudo subir la imagen','error')
        })
  }

}
