import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../../environments/dynamic-environment';
import {Club} from '../../_entities/clubs/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService extends ApiService<Club> {

  protected endpoint = 'clubs';

  constructor(
    httpClient: HttpClient,
    @Inject(DYNAMIC_ENVIRONMENT) environment: DynamicEnvironment
  ) {
    super(httpClient, environment);
  }
}
