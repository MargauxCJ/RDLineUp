import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../environments/dynamic-environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string;

  constructor(
    @Inject(DYNAMIC_ENVIRONMENT) private environment: DynamicEnvironment,
    private httpClient: HttpClient
  ) {
    this.apiUrl = this.environment.apiUrl;
  }

  // public getUsers(): Observable<any> {
  //   return this.httpClient.get(`${this.apiUrl}users/`);
  // }
  //
  // public getBands(): Observable<Band[]> {
  //   return this.httpClient.get<Band[]>(`${this.apiUrl}bands/`);
  // }
  //
  // public getBandById(id: string): Observable<Band> {
  //   return this.httpClient.get<Band>(`${this.apiUrl}bands/${id}`);
  // }
}
