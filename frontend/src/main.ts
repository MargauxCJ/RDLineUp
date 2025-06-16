import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading} from '@angular/router';
import {routes} from './app/app.routes';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {DYNAMIC_ENVIRONMENT, dynamicEnvironment, fetchDynamicEnvironment} from './environments/dynamic-environment';
import {authInterceptorFn} from './app/_interceptors/auth.interceptor';

(async () => {
  await fetchDynamicEnvironment();

  bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),
      { provide: DYNAMIC_ENVIRONMENT, useValue: dynamicEnvironment },
      provideHttpClient(
        withInterceptors([authInterceptorFn])
      ),
    ]
  });
})();
