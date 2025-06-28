import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../environments/dynamic-environment';
import {User} from '../_entities/users/user.model';
import {map, tap} from 'rxjs/operators';
import {library} from 'ionicons/icons';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

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

  public getUsers(): Observable<User[]> {
    return this.httpClient
      .get<PaginatedResult<User>>(`${this.apiUrl}users/paginated`)
      .pipe(
        tap(res => console.log('Response from API:', res)),
        map(response => response.data)
      );
  }


  //
  // public getBands(): Observable<Band[]> {
  //   return this.httpClient.get<Band[]>(`${this.apiUrl}bands/`);
  // }
  //
  // public getBandById(id: string): Observable<Band> {
  //   return this.httpClient.get<Band>(`${this.apiUrl}bands/${id}`);
  // }
}
