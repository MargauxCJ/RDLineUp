import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { MessageService } from 'src/common/services/message/message.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseService<T> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly messageService: MessageService,
    private readonly entityLabel: string,
  ) {}

  public findAll(): Observable<T[]> {
    return from(this.repository.find()).pipe(this.handleError<T[]>());
  }

  public findOneByField<K extends keyof T>(
    field: K,
    value: T[K],
    notFoundKey = 'NOT_FOUND',
  ): Observable<T> {
    return from(this.repository.findOneBy({ [field]: value } as any)).pipe(
      map((item) => {
        if (!item) {
          throw new NotFoundException(
            this.messageService.get(notFoundKey, this.entityLabel),
          );
        }
        return item;
      }),
      this.handleError<T>(),
    );
  }

  public deleteOneByField<K extends keyof T>(
    field: K,
    value: T[K],
    notFoundMessage = 'NOT_FOUND',
  ): Observable<any> {
    const whereCondition: FindOptionsWhere<T> = {
      [field]: value,
    } as FindOptionsWhere<T>;

    return this.findOneByField(field, value, notFoundMessage).pipe(
      switchMap(() => from(this.repository.delete(whereCondition))),
      this.handleError<any>(),
    );
  }

  public updateOneByField<K extends keyof T>(
    field: K,
    value: T[K],
    updateData: QueryDeepPartialEntity<T>,
    notFoundMessage = 'NOT_FOUND',
  ): Observable<any> {
    const whereCondition: FindOptionsWhere<T> = {
      [field]: value,
    } as FindOptionsWhere<T>;

    return this.findOneByField(field, value, notFoundMessage).pipe(
      switchMap(() => from(this.repository.update(whereCondition, updateData))),
      this.handleError<any>(),
    );
  }

  public create(data: DeepPartial<T>): Observable<T> {
    return from(this.repository.save(data)).pipe(
      switchMap((createdEntity: T) => {
        const id = (createdEntity as any).id;
        return this.findOneByField('id' as keyof T, id);
      }),
      this.handleError<T>(),
    );
  }

  protected handleError<U>() {
    return catchError<U, Observable<never>>((err: unknown) => {
      if (err instanceof HttpException) {
        return throwError(() => err);
      }
      console.error(err);
      return throwError(
        () =>
          new InternalServerErrorException(
            this.messageService.get('SERVER_ERROR'),
          ),
      );
    });
  }
}
