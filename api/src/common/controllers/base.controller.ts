import { Observable } from 'rxjs';

export class BaseController<T> {
  constructor(protected readonly service: any) {}

  findAll(): Observable<T[]> {
    return this.service.findAll();
  }

  findOneByField<K extends keyof T>(field: K, value: T[K]): Observable<T> {
    return this.service.findOneByField(field, value);
  }

  deleteOneByField<K extends keyof T>(field: K, value: T[K]): Observable<any> {
    return this.service.deleteOneByField(field, value);
  }
}
