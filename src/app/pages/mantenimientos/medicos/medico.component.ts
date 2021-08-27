import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Hospital } from 'src/app/models/hospital.model';

import { MedicoService } from 'src/app/services/medico.service';
import { HospitalService } from '../../../services/hospital.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { interval,pipe } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado!: Medico;
  public hospitalSeleccionado!: Hospital | undefined;

  constructor(private _fb: FormBuilder,
              private _hospitalService: HospitalService,
              private _medicoService: MedicoService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this._activatedRoute.params
        .subscribe( ({id}) => this.cargarMedico(id) );

    // this._medicoService.obtenerMedicoPorId()
    this.medicoForm = this._fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });
    
    this.cargarHospitales()

    this.medicoForm.get('hospital')?.valueChanges
        .subscribe(hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find( hospital => hospital._id === hospitalId);
        })
  }

  guardarMedico(){

    const {nombre} = this.medicoForm.value;

    if (this.medicoSeleccionado){
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this._medicoService.actualizarMedico(data)
          .subscribe( resp => {
            console.log(resp)
            Swal.fire('Médico actualizado',`${nombre} se actualizo correctamente`, 'success');
          })
    } else {
      this._medicoService.crearMedico(this.medicoForm.value)
          .subscribe( (resp: any) => {
            Swal.fire('Médico creado',`${nombre} creado correctamente`, 'success');
            this._router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
          })
    }

  }

  cargarHospitales(){
    this._hospitalService.cargarHospitales()
        .subscribe((hospitales: Hospital[]) => {
          this.hospitales = hospitales;
        })
  }

  cargarMedico(id: string){

    if (id === 'nuevo') return

    this._medicoService.obtenerMedicoPorId(id)
        .pipe(
          delay(200)
        )
        .subscribe( (medico: any) => {
          const {nombre, hospital:{_id}} = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({nombre, hospital: _id});

          // My Method 
          //
          // this.medicoForm.reset({nombre: medico.nombre, hospital: medico.hospital?._id})
        }, error => {
          return this._router.navigateByUrl(`/dashboard/medicos`);
        });
  }

}
