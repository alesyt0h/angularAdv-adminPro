import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';

import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];
  public termino: string = '';

  constructor(private _activatedRoute: ActivatedRoute,
              private _busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this._activatedRoute.params
        .subscribe( ({termino}) => this.busquedaGlobal(termino));
  }

  busquedaGlobal(termino: string){
    this._busquedasService.busquedaGlobal(termino)
        .subscribe((resp: any) => {
          console.log(resp);
          this.termino    = termino;
          this.usuarios   = resp.usuarios;
          this.medicos    = resp.medicos;
          this.hospitales = resp.hospitales;
        })
  }

}
