import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { ErrorHandlerService } from './../services/error-handler.service'

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private errorService: ErrorHandlerService) {}
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
        .pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                const message = this.errorService.handleError(error)
                return throwError(message)
            })
        )
    }
}
