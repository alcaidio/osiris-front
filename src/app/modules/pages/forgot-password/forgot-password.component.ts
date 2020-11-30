import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { TreoAnimations } from '../../../../@treo/animations/public-api'
import { AuthService } from '../../auth/services/auth.service'

@AutoUnsubscribe()
@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: TreoAnimations,
})
export class AuthForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup
  message: any

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.message = null
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  sendResetLink(): void {
    if (this.forgotPasswordForm.invalid) {
      return
    }
    const email = this.forgotPasswordForm.value.email.toString()
    this.forgotPasswordForm.disable()
    this.message = null
    this.authService
      .forgottenPasswordRequest(email)
      .pipe(
        catchError((error) => {
          if (error) {
            this.setMessage(error, 'error')
          }
          return of(error)
        })
      )
      .subscribe((res) => {
        if (res.message) {
          this.setMessage(res.message, 'success')
        }
        this.forgotPasswordForm.enable()
        this.forgotPasswordForm.reset({})
      })
  }

  private setMessage(message: string, type: string) {
    this.message = {
      appearance: 'outline',
      content: message,
      shake: false,
      showIcon: false,
      type,
    }
  }

  ngOnDestroy() {
    //
  }
}
