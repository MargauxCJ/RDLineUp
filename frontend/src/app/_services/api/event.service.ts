import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../../environments/dynamic-environment';
import {Event} from '../../_entities/events/event.model';
@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService<Event> {

  protected endpoint = 'events';

  constructor(
    httpClient: HttpClient,
    @Inject(DYNAMIC_ENVIRONMENT) environment: DynamicEnvironment
  ) {
    super(httpClient, environment);
  }
}
