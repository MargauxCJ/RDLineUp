import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DYNAMIC_ENVIRONMENT, DynamicEnvironment} from '../../environments/dynamic-environment';
import {User} from '../_entities/users/user.model';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private apiUrl: string;

  constructor(
    @Inject(DYNAMIC_ENVIRONMENT) private environment: DynamicEnvironment,
    private httpClient: HttpClient
  ) {
    this.apiUrl = this.environment.apiUrl;
  }

  getImgProfileCurrentUser(user: User): string {
    return 'url('+this.apiUrl+'users/profile-image/'+ user?.imgProfile + ')';
  }


  getImgProfileEntity(entityName: string, entity: any) : string {
    return (entity.imgProfile !== null || undefined) ? `url(${this.apiUrl}${entityName}/profile-image/${entity.imgProfile})` : '';
  }
}
