import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'https://localhost:5001/api/student';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    // SSL sertifika sorununu çözmek için
    withCredentials: false
  };

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    console.log('API çağrısı yapılıyor:', `${this.apiUrl}/getStudents`);
    
    return this.http.get<Student[]>(`${this.apiUrl}/getStudents`, this.httpOptions)
      .pipe(
        retry(2), // 2 kez tekrar dene
        catchError(this.handleError)
      );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/getStudent/${id}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API Hatası:', error);
    
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Hata: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Sunucu Hatası: ${error.status} - ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
