import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { NotificationService } from 'app/shared/services/notification.service'
import { EMPTY, Observable, of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import { AuthService } from '../../auth/services/auth.service'

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router, private notification: NotificationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    // NOTE : IF no authenticated else you can pass
    const email = route.params['email']
    const uuid = route.params['uuid']
    return this.authService.forgottenPasswordValidation({ email, uuid }).pipe(
      catchError(() => {
        this.router.navigate(['/forgot-password'])
        setTimeout(
          () =>
            this.notification.openSnackBar(
              'Votre lien semble avoir expiré, veuillez en regénérer un nouveau.',
              'X',
              10000,
              'start',
              'top'
            ),
          1500
        )

        return EMPTY
      }),
      mergeMap((something) => {
        if (something) {
          return of(something)
        } else {
          return EMPTY
        }
      })
    )
  }
}
