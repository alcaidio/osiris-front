import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Data, Router } from '@angular/router'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { TreoAnimations } from '../../../../@treo/animations/public-api'
import { TreoValidators } from '../../../../@treo/validators/validators'
import { AuthService } from '../../auth/services/auth.service'

@AutoUnsubscribe()
@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: TreoAnimations,
})
export class AuthResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup
  message = null
  dataFromResolver: { email: string; uuid: string }
  @ViewChild('passwordConfirmField') passwordConfirmField: ElementRef

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(5)]],
        passwordConfirm: ['', Validators.required],
      },
      {
        validators: TreoValidators.mustMatch('password', 'passwordConfirm'),
      }
    )

    this.route.data.subscribe((data: Data) => {
      this.dataFromResolver = data['payload']
    })
  }

  onPressPasswordConfirm() {
    this.passwordConfirmField.nativeElement.focus()
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return
    }

    this.resetPasswordForm.disable()
    this.message = null

    // TODO :
    // if (isAuthenticated) {
    //     this.store.dispatch(new ResetPassword(...toolbar))
    // } else {
    //   this.store.dispatch(new ResetForgottenPassword())
    // }

    const params = {
      ...this.dataFromResolver,
      newPassword: this.resetPasswordForm.value.password.toString(),
    }

    this.authService
      .forgottenPasswordReset(params)
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
          setTimeout(() => {
            this.router.navigate(['./sign-in'])
            this.resetPasswordForm.enable()
            this.resetPasswordForm.reset({})
          }, 3500)
        } else {
          this.resetPasswordForm.enable()
          this.resetPasswordForm.reset({})
        }
      })
  }

  onSwitchPasswordIcon(passwordField: HTMLInputElement): void {
    if (passwordField.type === 'password') {
      passwordField.type = 'text'
    } else {
      passwordField.type = 'password'
    }
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
    // because AutoUnsubscribe
  }
}
