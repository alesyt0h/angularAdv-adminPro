import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private transformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario(user.nombre, user.email,'', user.img, user.google, user.role, user.uid)
    )
  }
  
  private transformarMedicos(resultados: any[]): Medico[]{
    return resultados;
  }

  private transformarHospitales(resultados: any[]): Hospital[]{
    return resultados;

    // No haria falta crear la instancia de Hospital pues no necesita usar sus propiedades en ningun lado mas que en el mantenimiento de hospitales
    //
    // return resultados.map(
    //   hospital => new Hospital(hospital.nombre,hospital._id,hospital.img,hospital.usuario)
    // )
  }

  busquedaGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this._http.get(url, this.headers)
  }


  buscar( tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string ): Observable<Usuario[] | Medico[] | Hospital[]>{
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this._http.get<any[]>(url, this.headers)
        .pipe(
          map((resp: any) => {
            switch (tipo) {
              case 'usuarios':
                return this.transformarUsuarios(resp.resultados)

              case 'medicos':
                return this.transformarMedicos(resp.resultados)

              case 'hospitales':
                return this.transformarHospitales(resp.resultados)
                
              default: 
                return [];
            }
          })
        )
  }
}
