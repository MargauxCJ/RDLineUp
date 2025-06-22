import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { MessageService } from 'src/common/services/message/message.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {ClassConstructor, instanceToPlain, plainToInstance} from 'class-transformer';
import {PaginatedResultDto} from 'src/common/entities/paginatedResult.dto';

export class BaseService<T> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly messageService: MessageService,
    private readonly entityLabel: string,
  ) {}

  public findAll<V>(
    dtoClass?: ClassConstructor<V>,
    relations: string[] = []
  ): Observable<V[]> {
    return from(this.repository.find({ relations })).pipe(
      map((entities) => this.mapToPlain(entities, dtoClass)),
      catchError((error) => {
        throw error;
      })
    );
  }

  public findAllPaginated<V>(
    dtoClass: ClassConstructor<V>,
    page: number = 1,
    limit: number = 10,
    relations: string[] = []
  ): Observable<PaginatedResultDto<V>> {
    const skip = (page - 1) * limit;

    return from(
      this.repository.findAndCount({
        skip,
        take: limit,
        relations,
      })
    ).pipe(
      map(([entities, total]) => {
        const data = entities.map(e => plainToInstance(dtoClass, e));
        return new PaginatedResultDto(data, total, page, limit);
      }),
    );
  }


  public findOneByField<K extends keyof T>(
    field: K,
    value: T[K],
    notFoundKey = 'NOT_FOUND',
  ): Observable<any> {
    return from(this.repository.findOneBy({ [field]: value } as any)).pipe(
      map((item) => {
        if (!item) {
          throw new NotFoundException(
            this.messageService.get(notFoundKey, this.entityLabel),
          );
        }
        return this.mapToPlain(item);
      }),
      this.handleError<any>(),
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
      this.handleError<any>(),
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

  protected mapToPlain<V>(data: T | T[], dtoClass?: ClassConstructor<V>): any {
    if (dtoClass) {
      if (Array.isArray(data)) {
        return plainToInstance(dtoClass, data, { exposeUnsetFields: false })
          .map((dto) => instanceToPlain(dto));
      } else {
        const dto = plainToInstance(dtoClass, data, { exposeUnsetFields: false });
        return instanceToPlain(dto);
      }
    }
    return instanceToPlain(data);
  }
}
