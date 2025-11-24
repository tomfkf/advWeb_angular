import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MobilePost } from '../models/mobile-post';
import { Observable } from 'rxjs';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';
import { MobilePostQueryRequest } from '../models/mobile-post-query-request';

@Injectable({
  providedIn: 'root',
})
export class MobilePostService {
  private apiUrl = 'http://localhost:3000/mobilePost';

  constructor(private http: HttpClient) {}

  getAllRecords(): Observable<MobilePostQueryResult> {
    const params = new HttpParams().set('limit', 9999999);
    return this.http.get<MobilePostQueryResult>(`${this.apiUrl}`, { params });
  }

  getRecord(query: MobilePostQueryRequest): Observable<MobilePostQueryResult> {
    return this.http.get<MobilePostQueryResult>(`${this.apiUrl}`, {
      params: this.cleanUp(query) as any,
    });
  }
  getRecordById(id: number): Observable<MobilePostQueryResult> {
    let query = new MobilePostQueryRequest();
    query.id = [id];
    return this.http.get<MobilePostQueryResult>(`${this.apiUrl}`, {
      params: this.cleanUp(query) as any,
    });
  }

  deleteRecordById(id: number): void {
    this.http.delete<MobilePostQueryResult>(`${this.apiUrl}/${id}`).subscribe((response) => {
      console.log('Delete response:', response);
    });
  }

  updateRecord(mobilePost: MobilePost, id: number): void {
    this.http
      .put<MobilePostQueryResult>(`${this.apiUrl}/${id}`, mobilePost)
      .subscribe((response) => {
        console.log('Update response:', response);
      });
  }

  createRecord(mobilePost: MobilePost): void {
    this.http.post<MobilePostQueryResult>(`${this.apiUrl}`, mobilePost).subscribe((response) => {
      console.log('Create response:', response);
    });
  }

  private cleanUp(object: any): any {
    const cleanedObject: any = {};
    for (const key in object) {
      if (object[key] !== null && object[key] !== undefined && object[key] !== '') {
        cleanedObject[key] = object[key];
      }
    }
    return cleanedObject;
  }
}
