import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Data, Router } from '@angular/router'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
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

  @ViewChild('passwordConfirmField') password2: ElementRef

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

  onPressPassword1() {
    this.password2.nativeElement.focus()
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

    this.authService.forgottenPasswordReset({
      ...this.dataFromResolver,
      newPassword: this.resetPasswordForm.value.password,
    })

    setTimeout(() => {
      this.message = {
        appearance: 'outline',
        content: 'message',
        shake: false,
        showIcon: false,
        type: 'success',
      }
      setTimeout(() => {
        this.resetPasswordForm.enable()
        this.resetPasswordForm.reset({})
        this.router.navigate(['/sign-in'])
      }, 3000)
    }, 1000)
  }

  onSwitchPasswordIcon(passwordField: HTMLInputElement): void {
    if (passwordField.type === 'password') {
      passwordField.type = 'text'
    } else {
      passwordField.type = 'password'
    }
  }

  ngOnDestroy() {
    // because AutoUnsubscribe
  }
}
