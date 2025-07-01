import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { User } from '../../_entities/users/user.model';
import { DYNAMIC_ENVIRONMENT, DynamicEnvironment } from '../../../environments/dynamic-environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends ApiService<User> {

  protected endpoint = 'users';

  constructor(
    httpClient: HttpClient,
    @Inject(DYNAMIC_ENVIRONMENT) environment: DynamicEnvironment
  ) {
    super(httpClient, environment);
  }

  login(email: string, password: string): Observable<string> {
    return this.httpClient.post<{ access_token: string }>(`${this.apiUrl}${this.endpoint}/login`, { email, password })
      .pipe(
        map(response => response.access_token)
      );
  }

  getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}${this.endpoint}/current-user`);
  }
}
