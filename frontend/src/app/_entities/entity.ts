import {plural} from 'pluralize';
export interface EntityInterface {
  id: string;
  '@id': string;
  createdAt: Date;
  updatedAt: Date;
}

export class AbstractEntity implements EntityInterface {
  public id: string = null;
  public '@id': string = null;
  public '@type': string = null;
  public createdAt: Date = null;
  public updatedAt: Date = null;

  public get uri(): string {
    return this['@id'];
  }

  public static getEntityName(): string {
    throw new Error('getEntityName not implemented');
  }

  public static getBaseUri(): string {
    return `/${plural(this.getEntityName())}`;
  }
}
