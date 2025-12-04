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


  getLocationByLatLng(lat: number, lng: number) : Observable<any> { 
    let result:MobilePost = new MobilePost();

    const en = this.getLocationByLatLngWithLanguage(lat, lng,'en').subscribe(res => {
      if(res && res.address) {
        result.addressEN = res.address.road || '';
        result.districtEN = res.address.city || '';
        result.locationEN = res.address.suburb || '';
      }
    });
    const tc = this.getLocationByLatLngWithLanguage(lat, lng,'zh-HK').subscribe(res => {
      if(res && res.address) {
        result.addressTC = res.address.road || '';
        result.districtTC = res.address.city || '';
        result.locationTC = res.address.suburb || '';
      }
    });
    const sc = this.getLocationByLatLngWithLanguage(lat, lng,'zh-CN').subscribe(res => {
      if(res && res.address) {
        result.addressSC = res.address.road || '';
        result.districtSC = res.address.city || '';
        result.locationSC = res.address.suburb || '';
      }
    });
    
    
    return new Observable<any>(observer => {
      Promise.all([en, tc, sc]).then(() => {
        observer.next(result);
        observer.complete();
      });
    });
  }

  getLocationByLatLngWithLanguage(lat: number, lng: number,language : string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse`;
    const params = new HttpParams()
      .set('lat', `${lat}`)
      .set('lon', `${lng}`)
      .set('accept-language', language)
      .set('format', 'json');

    return this.http.get<any>(url, { params });
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
