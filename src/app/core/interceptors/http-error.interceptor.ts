import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = ''
        let clientError = false

        if (!!error['error']) {
          // client-side error
          errorMessage = `${error['error'].message}`
          clientError = true
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
        }
        console.log('Error: ', error)
        console.log('Error message: ', errorMessage)
        console.log('Client-side error: ', clientError)

        return throwError(errorMessage)
      })
    )
  }
}
