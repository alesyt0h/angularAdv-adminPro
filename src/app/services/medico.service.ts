import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class MedicoService {

  constructor(private _http: HttpClient) { }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos(){
    
    interface Medicos { ok: boolean, medicos: Medico[] }
    
    return this._http.get<Medicos>(`${base_url}/medicos`,this.headers)
               .pipe( map(resp => resp.medicos) )
  }

  obtenerMedicoPorId(id: string){
    return this._http.get<{ ok: boolean, medico: Medico}>(`${base_url}/medicos/${id}`,this.headers)
               .pipe( map(resp => resp.medico) )
  }

  crearMedico(medico: {nombre: string, hospital: string}){
    return this._http.post(`${base_url}/medicos`,medico, this.headers)
  }

  actualizarMedico(medico: Medico){
    return this._http.put(`${base_url}/medicos/${medico._id}`,medico, this.headers)
  }

  borrarMedico(_id: string){
    return this._http.delete(`${base_url}/medicos/${_id}`,this.headers)
  }


}
