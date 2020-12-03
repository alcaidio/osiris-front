import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { NotificationService } from 'app/shared/services/notification.service'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthService } from '../../auth/services/auth.service'

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router, private notification: NotificationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    // NOTE : IF no authenticated else you can pass
    const email = route.queryParams.email
    const uuid = route.queryParams.uuid

    return this.authService.forgottenPasswordValidation({ email, uuid }).pipe(
      map(() => {
        return { email, uuid }
      }),
      catchError((error) => {
        this.router.navigate(['/forgot-password'])
        setTimeout(() => this.notification.openSnackBarWithTraduction(error, 'X', 10000, 'start', 'top'), 1500)
        return EMPTY
      })
    )
  }
}
