import { Injectable, ViewContainerRef } from '@angular/core'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar'
import { TranslocoService } from '@ngneat/transloco'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar, private translocoService: TranslocoService) {}

  openSnackBar(
    message: string,
    action?: string,
    duration?: number,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition,
    viewContainerRef?: ViewContainerRef
  ) {
    if (!action) {
      action = 'X'
    }
    if (!duration) {
      duration = 4000
    }
    if (!horizontalPosition) {
      horizontalPosition = 'center'
    }
    if (!verticalPosition) {
      verticalPosition = 'bottom'
    }
    this._snackBar.open(message, action, {
      duration,
      horizontalPosition,
      verticalPosition,
      viewContainerRef,
      panelClass: 'custom-snackbar',
    })
  }

  openSnackBarWithTraduction(
    message: string,
    action?: string,
    duration?: number,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition,
    viewContainerRef?: ViewContainerRef
  ) {
    const traduction = this.translocoService.translate<string>(message)

    if (!action) {
      action = 'X'
    }
    if (!duration) {
      duration = 4000
    }
    if (!horizontalPosition) {
      horizontalPosition = 'center'
    }
    if (!verticalPosition) {
      verticalPosition = 'bottom'
    }
    this._snackBar.open(traduction, action, {
      duration,
      horizontalPosition,
      verticalPosition,
      viewContainerRef,
    })
  }
}
