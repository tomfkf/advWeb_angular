import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MobilePost } from '../models/mobile-post';
import { Observable } from 'rxjs';
import { MobilePostQueryResult } from '../models/mobile-post-query-result';

@Injectable({
  providedIn: 'root',
})
export class MobilePostService {
  private apiUrl = 'http://localhost:3000/mobilePost';

  constructor(private http: HttpClient) {}


  getAllRecords(): Observable<MobilePostQueryResult> {
    const params = new HttpParams()
    .set('limit', 9999999);
    return this.http.get<MobilePostQueryResult>(`${this.apiUrl}`, { params });
  }
}
