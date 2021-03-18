import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NotificationService } from 'app/shared/services/notification.service'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notifications: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        this.notifications.openSnackBar(`Error ${error.status}:  ${error.statusText}.`)
        return throwError(error)
      })
    )
  }
}
