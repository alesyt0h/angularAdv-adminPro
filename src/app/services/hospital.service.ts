import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { map } from 'rxjs/operators';

const baseUrl = `${environment.base_url}/hospitales`;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  cargarHospitales(){
    interface Hospitales { ok: boolean, hospitales: Hospital[] }

    return this._http.get<Hospitales>(baseUrl,this.headers)
               .pipe(
                 map( (resp: Hospitales) => resp.hospitales )
               )

    // Above method is cleaner than this
    //
    // return this._http.get<{ ok: boolean, hospitales: Hospital[] }>(`${baseUrl}/hospitales`,this.headers)
    //            .pipe(
    //              map( (resp: { ok: boolean, hospitales: Hospital[] }) => resp.hospitales )
    //            )
  }

  crearHospital(nombre: string){
    return this._http.post(baseUrl,{nombre},this.headers);
  }

  actualizarHospital(_id: string, nombre: string){
    return this._http.put(`${baseUrl}/${_id}`,{nombre},this.headers);
  }

  borrarHospital(_id: string){
    return this._http.delete(`${baseUrl}/${_id}`,this.headers);
  }
}
