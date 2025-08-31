import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const clonedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        if (
          error.error?.message === 'Invalid token' || 
          error.status === 401 ||                     
          error.status === 403 ||                  
          error.status >= 500                        
        ) {
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }

        return throwError(() => error);
      })
    );
  }
}
