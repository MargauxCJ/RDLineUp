import {
  HttpException,
  InternalServerErrorException,
  NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import {DeepPartial, FindOptionsWhere, In, Repository} from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { MessageService } from 'src/common/services/message/message.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {ClassConstructor, instanceToPlain, plainToInstance} from 'class-transformer';
import {PaginatedResultDto} from 'src/common/entities/paginatedResult.dto';
import {basename, join} from 'path';
import * as fs from 'node:fs';
import {UserEntity, UserRole} from 'src/user/entity/user.entity';

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
    relations: string[] = [],
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    currentUser?: UserEntity,
  ): Observable<PaginatedResultDto<V>> {
    const skip = (page - 1) * limit;

    const modifiedWhere = this.restrictAccessToUserScope(where, currentUser);

    return from(
      this.repository.findAndCount({
        skip,
        take: limit,
        relations,
        where: modifiedWhere,
      }),
    ).pipe(
      map(([entities, total]) => {
        const data = entities.map(e => plainToInstance(dtoClass, e));
        return new PaginatedResultDto(data, total, page, limit);
      }),
    );
  }

  protected restrictAccessToUserScope(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined,
    currentUser?: UserEntity,
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined {
    if (!currentUser) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (currentUser.role === UserRole.ADMIN) {
      return where;
    }

    const userTeamIds = currentUser.teams?.map(team => team.id) || [];

    if (userTeamIds.length === 0) {
      return { id: -1 } as any;
    }

    const teamFilter = { teams: { id: In(userTeamIds) } } as any;

    if (!where) {
      return teamFilter;
    }

    if (Array.isArray(where)) {
      return where.map(w => ({ ...w, ...teamFilter }));
    }

    return { ...where, ...teamFilter };
  }



  public findOneByField<K extends keyof T, R = T>(
    field: K,
    value: T[K],
    notFoundKey = 'NOT_FOUND',
    mapToDto?: (entity: T) => R,
    relations: string[] = [],
  ): Observable<R> {
    return from(
      this.repository.findOne({
        where: { [field]: value } as any,
        relations,
      })
    ).pipe(
      map((item) => {
        if (!item) {
          throw new NotFoundException(
            this.messageService.get(notFoundKey, this.entityLabel),
          );
        }
        const mapped = mapToDto ? mapToDto(item) : (this.mapToPlain(item) as R);
        return mapped;
      }),
      this.handleError<R>(),
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
    updateData: DeepPartial<T>,
    notFoundMessage = 'NOT_FOUND',
  ): Observable<any> {
    const whereCondition: FindOptionsWhere<T> = {
      [field]: value,
    } as FindOptionsWhere<T>;

    return this.findOneByField(field, value, notFoundMessage).pipe(
      switchMap((existingEntity) => {
        const hasRelations = Object.entries(updateData).some(([_, val]) =>
          Array.isArray(val) || typeof val === 'object'
        );

        if (hasRelations) {
          const merged = this.repository.merge(existingEntity, updateData);
          return from(this.repository.save(merged));
        } else {
          // ⬇️ Cast ici uniquement pour update
          return from(this.repository.update(
            whereCondition,
            updateData as QueryDeepPartialEntity<T>
          ));
        }
      }),
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

  updateImage<K extends keyof T>(
    id: number,
    imageField: K,
    file: Express.Multer.File,
    imageFolder: string,
    defaultImage?: string,
  ): Observable<{ [P in K]: string }> {
    return from(this.repository.findOneBy({ id } as any)).pipe(
      switchMap(entity => {
        if (!entity) {
          throw new NotFoundException(`Entité avec id ${id} non trouvée`);
        }

        const currentImage = entity[imageField] as unknown as string;

        if (
          currentImage &&
          (!defaultImage || currentImage !== defaultImage)
        ) {
          const oldPath = join(process.cwd(), 'uploads', imageFolder, currentImage);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        entity[imageField] = file.filename as unknown as T[K];
        return from(this.repository.save(entity));
      }),
      map(() => ({ [imageField]: file.filename } as { [P in K]: string })),
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
