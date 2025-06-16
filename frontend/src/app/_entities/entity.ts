import {plural} from 'pluralize';
export interface EntityInterface {
  id: string;
  '@id': string;
}

export class AbstractEntity implements EntityInterface {
  public id: string = null;
  public '@id': string = null;
  public '@type': string = null;

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
