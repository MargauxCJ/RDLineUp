import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DYNAMIC_ENVIRONMENT, DynamicEnvironment } from '../../../environments/dynamic-environment';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {
  protected readonly apiUrl: string;

  constructor(
    protected httpClient: HttpClient,
    @Inject(DYNAMIC_ENVIRONMENT) protected environment: DynamicEnvironment
  ) {
    this.apiUrl = this.environment.apiUrl;
  }

  getAllPaginated(page: number, size: number, endpoint: string): Observable<PaginatedResult<T>> {
    return this.httpClient.get<PaginatedResult<T>>(
      `${this.apiUrl}${endpoint}/paginated?page=${page}&size=${size}`
    );
  }

  getOne(id: string, endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}${endpoint}/${id}`);
  }

  postOne(body: T, endpoint: string): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}${endpoint}`, body);
  }

  updateOne(id: string, body: T, endpoint: string): Observable<T> {
    return this.httpClient.put<T>(`${this.apiUrl}${endpoint}/${id}`, body);
  }

  deleteOne(id: string, endpoint: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}${endpoint}/${id}`);
  }
}
