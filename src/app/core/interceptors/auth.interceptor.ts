import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from '@ngxs/store'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthUtils } from '../../modules/auth/auth.utils'
import { Logout } from './../../modules/auth/store/actions/auth.actions'
import { AuthStatusState } from './../../modules/auth/store/states/auth-status.state'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = req.clone()
    const token = this.store.selectSnapshot(AuthStatusState.getJWT)

    if (token && token !== null && !AuthUtils.isTokenExpired(token)) {
      if (!req.headers.get('skip')) {
        newReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
        })
      }
    } else {
      this.store.dispatch(new Logout())
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
