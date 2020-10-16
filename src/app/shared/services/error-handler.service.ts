import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { NotificationService } from './notification.service'
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
 
  constructor(private router: Router, private notification: NotificationService) { }
 
  public handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      this.clientError(error)
    } else {
      if (error.status === 500) {
        this.handle500Error(error)
      } else if (error.status === 404) {
        this.handle404Error(error)
      } else {
        this.handleOtherError(error)
      }
    }
  }

  private clientError = (error: HttpErrorResponse) => {
    this.createErrorMessageClient(error)
  }
 
  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error)
    this.router.navigate(['/error/500'])
  }

  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error)
    this.router.navigate(['/error/404'])
  }
 
  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error)
    // TODO: build other errors
  }
 
  private createErrorMessage = (error: HttpErrorResponse): string => {
    console.log(error)
    const message = `Error ${error.status}. ${error.statusText}. ${error.error.message}`
    this.notification.openSnackBar(message, 'X', ['snack-error'])
    return message
  }

  private createErrorMessageClient = (error: HttpErrorResponse): string => {
    console.log(error)
    const message = `Error ${error.status}. ${error.statusText}.`
    this.notification.openSnackBar(message, 'X', ['snack-error'])
    return message
  }
}
