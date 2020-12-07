import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from '@ngxs/store'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthUtils } from '../../modules/auth/auth.utils'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = req.clone()
    const token = JSON.parse(localStorage.getItem('auth.status.jwt'))
    
    if (token && token !== null && !AuthUtils.isTokenExpired(token)) {
      newReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      })
    }

    return next.handle(newReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          location.reload()
        }

        return throwError(error)
      })
    )
  }
}
