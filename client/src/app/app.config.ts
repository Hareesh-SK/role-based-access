import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AppHttpInterceptor } from './core/http.interceptor';
import { API_BASE_URL } from './core/tokens';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


export const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: API_BASE_URL, useValue: '/api' }
  ]
};
