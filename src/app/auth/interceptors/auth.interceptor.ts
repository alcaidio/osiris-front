import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from '@ngxs/store'
import { AuthUtils } from 'app/auth/auth.utils'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Logout } from '../store'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request object
    let newReq = req.clone()
    const storage = JSON.parse(localStorage.getItem('auth.status'))
    const token = storage.jwt

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (token && !AuthUtils.isTokenExpired(token)) {
      newReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      })
    }

    // Response
    return next.handle(newReq).pipe(
      catchError((error) => {
        // Catch "401 Unauthorized" responses
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.store.dispatch(new Logout())
          location.reload()
        }

        return throwError(error)
      })
    )
  }
}
