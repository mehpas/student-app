import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
 // private apiUrl = 'http://localhost:5000/api/material';
  
  //private apiUrl = 'https://cqrs-api-demo-gfcxbaezfxe7bpfd.westeurope-01.azurewebsites.net/api/material';
  private apiUrl = 'https://cqrsdemoapi20250930225359-csekhndrh6edfvhm.westeurope-01.azurewebsites.net/api/material';

  constructor(private http: HttpClient) { }  

  getMaterials(hisseKodu?: string): Observable<Material[]> {
    let url = this.apiUrl;
    if (hisseKodu) {
      url += `?hisseKodu=${hisseKodu}`;
    }
    debugger;
    return this.http.get<Material[]>(url);
  }

  getMaterialByCode(hisseKodu: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/${hisseKodu}`);
  }
}
