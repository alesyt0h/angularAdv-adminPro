import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  
  private imgSubs!: Subscription;


  constructor(private _hospitalService: HospitalService,
              private _modalImagenService: ModalImagenService,
              private _busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this._modalImagenService.nuevaImagen
        .pipe(delay(200))
        .subscribe(img => this.cargarHospitales());
  }

  cargarHospitales(){
    // Creo que seria mejor actualizar el hospital en el array para evitar demasiadas peticiones http
    this.cargando = true;

    this._hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
          this.hospitalesTemp = this.hospitales
        });
  }

  guardarCambios(hospital: Hospital){
    this._hospitalService.actualizarHospital(hospital._id!,hospital.nombre)
        .subscribe( resp => {
          this.cargarHospitales(); // Creo que seria mejor actualizar el hospital en el array para evitar demasiadas peticiones http
          Swal.fire('Actualizado', hospital.nombre, 'success')
        })
  }

  eliminarHospital(hospital: Hospital){
    this._hospitalService.borrarHospital(hospital._id!)
        .subscribe( resp => {
          this.cargarHospitales(); // Creo que seria mejor actualizar el hospital en el array para evitar demasiadas peticiones http
          Swal.fire('Borrado', hospital.nombre, 'success')
        })
  }

  async abrirSweetAlert(){
    const {value = '', ...valor} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })

    // if (valor.isDismissed) return;  // SImplemente se arregla asignandole un string vacio a value en la desestructuración
    
    if (value!.trim().length > 0) {
      this._hospitalService.crearHospital(value!)
          .subscribe((resp: any) => {
            this.hospitales.push(resp.hospital)
          })
    }

    // if (url) {
    //   Swal.fire(`Entered URL: ${url}`)
    // }
  }

  abrirModal(hospital: Hospital) {
    // if (this._usuarioService.usuario.role === 'ADMIN_ROLE'){
      this._modalImagenService.abrirModal('hospitales',hospital._id!,hospital.img);
    // }
  }

  searchQuery(termino: string){

    if (termino.length === 0) {
      this.hospitales = this.hospitalesTemp
      return;
      // return this.cargarHospitales(); // Para no complicarse mucho, pero seria mejor guardar los hospitales para tener la referencia local y así evitar hacer una petición extra
    }

    this._busquedasService.buscar('hospitales',termino)
        .subscribe((resp: Hospital[]) => {
          this.hospitales = resp
        })
  }

}
