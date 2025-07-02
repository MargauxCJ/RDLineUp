import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../../environments/dynamic-environment';
import {Team} from '../../_entities/teams/team.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiService<Team> {

  protected endpoint = 'teams';

  constructor(
    httpClient: HttpClient,
    @Inject(DYNAMIC_ENVIRONMENT) environment: DynamicEnvironment
  ) {
    super(httpClient, environment);
  }

  getTeamsByClub(clubId: number): Observable<Team[]> {
    return this.httpClient.get<Team[]>(`${this.apiUrl}${this.endpoint}/${clubId}/teams`);
  }
}
