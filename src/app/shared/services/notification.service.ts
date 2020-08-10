import { Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    action?: string,
    posX?: MatSnackBarHorizontalPosition,
    posY?: MatSnackBarVerticalPosition
  ) {
    this._snackBar.open(message, action, {
      duration: 4000,
      horizontalPosition: posX,
      verticalPosition: posY,
    })
  }
}
