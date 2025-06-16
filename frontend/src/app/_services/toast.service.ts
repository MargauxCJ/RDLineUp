import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular/standalone';
import {ToastOptions} from '@ionic/angular';
import {from, map, Observable, shareReplay, switchMap} from 'rxjs';

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  protected defaultOptions: Record<'default' | 'error', ToastOptions>;

  constructor(private toastController: ToastController) {
    this.defaultOptions = {
      default: {
        duration: 2500,
        color: 'primary',
      },
      error: {
        duration: 4000,
        color: 'danger',
      },
    };
  }

  public presentToast(
    message: ToastOptions['message'],
    options: ToastOptions = {},
  ): Observable<HTMLIonToastElement> {
    const toastOptions = {
      ...this.defaultOptions.default,
      message,
      ...options,
    };
    const toast$ = from(this.toastController.create(toastOptions)).pipe(
      switchMap(toast => from(toast.present()).pipe(map(() => toast))),
      shareReplay(1),
    );
    toast$.subscribe();
    return toast$;
  }

  public displayError(
    error: unknown,
    prefix?: string,
    options: ToastOptions = {},
  ): void {
    console.error(error);
    const toastOptions = {
      ...this.defaultOptions.error,
      ...options,
    };

    let message = 'Erreur inconnue.';

    if (this.isApiError(error)) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    this.presentToast(prefix ? `${prefix} : ${message}` : message, toastOptions);
  }

  private isApiError(error: any): error is ApiError {
    return error && typeof error.statusCode === 'number' && typeof error.message === 'string';
  }
}
