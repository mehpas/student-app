import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'https://localhost:5001/api/material';
  
 // private apiUrl = 'https://cqrsdemoapi20250930225359-csekhndrh6edfvhm.westeurope-01.azurewebsites.net/api/material';

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

  deleteMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${id}`);
  }
}
