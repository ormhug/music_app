import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MusicRecord } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  //CRUD для пластинок

  getRecords(): Observable<MusicRecord[]> {
    return this.http.get<MusicRecord[]>(`${this.apiUrl}/records`);
  }

  getRecord(id: number): Observable<MusicRecord> {
    return this.http.get<MusicRecord>(`${this.apiUrl}/records/${id}`);
  }

  addRecord(record: MusicRecord): Observable<MusicRecord> {
    return this.http.post<MusicRecord>(`${this.apiUrl}/records`, record);
  }

  updateRecord(id: number, record: MusicRecord): Observable<MusicRecord> {
    return this.http.put<MusicRecord>(`${this.apiUrl}/records/${id}`, record);
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/records/${id}`);
  }

  //Справочники (Форматы и Жанры)
  
  getFormats(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/formats`);
  }

  getGenres(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/genres`);
  }
}