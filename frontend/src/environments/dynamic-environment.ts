import { InjectionToken } from '@angular/core';

export interface DynamicEnvironment {
  apiUrl: string;
}

export const DYNAMIC_ENVIRONMENT = new InjectionToken<DynamicEnvironment>('DYNAMIC_ENVIRONMENT');

export const dynamicEnvironment: DynamicEnvironment = {} as DynamicEnvironment;

export const fetchDynamicEnvironment = async (): Promise<void> => {
  const response = await fetch('/assets/environment.json');
  const env = await response.json();
  Object.assign(dynamicEnvironment, env);
};
