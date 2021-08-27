import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando: boolean = true;
  public noMatches: boolean = false;

  private imgSubs!: Subscription;

  constructor(private _medicosService: MedicoService,
              private _modalImagenService: ModalImagenService,
              private _busquedasService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    
    this.imgSubs = this._modalImagenService.nuevaImagen
        .pipe(delay(200))
        .subscribe(img => this.cargarMedicos()); 
  }

  cargarMedicos(){
    this.cargando = true;
    this._medicosService.cargarMedicos()
        .subscribe(medicos => {
          this.cargando = false;
          this.noMatches = false;
          this.medicos = medicos;
          this.medicosTemp = medicos;
          // console.log(resp.medicos)
        })
  }

  borrarMedico(id: string, nombre:string){
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${nombre}, está seguro? 👀`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._medicosService.borrarMedico(id)
            .subscribe(resp => {
              Swal.fire(
                'Médico borrado',
                `El médico ${nombre} ha sido borrado`,
                'success'
              );
              this.cargarMedicos(); // Creo que seria mejor actualizar hospitales en el array para evitar demasiadas peticiones http
            })
      }
    });
  }

  actualizarMedico(){

  }

  buscarMedico(termino: string){

    if (termino.length === 0){
      this.medicos = this.medicosTemp;
      this.noMatches = false;
      return;
    }

    this._busquedasService.buscar('medicos',termino)
        .subscribe((medicos: Medico[]) => {
          if (medicos.length === 0){
            this.noMatches = true;
          }
          this.medicos = medicos;
        })
  }

  abrirModal(medico: Medico){
    this._modalImagenService.abrirModal('medicos',medico._id!,medico.img);
  }

}
