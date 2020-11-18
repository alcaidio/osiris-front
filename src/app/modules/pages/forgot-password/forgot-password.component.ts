import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TreoAnimations } from '../../../../@treo/animations/public-api'
import { AuthService } from '../../auth/services/auth.service'

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: TreoAnimations,
})
export class AuthForgotPasswordComponent implements OnInit {
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
    console.log(email)

    this.authService.forgottenPasswordRequest(email)

    // si status 200 ou 404 voir code sur wiki

    setTimeout(() => {
      this.forgotPasswordForm.enable()
      this.forgotPasswordForm.reset({})
      this.message = {
        appearance: 'outline',
        content: 'forgotPassword.message.send',
        shake: false,
        showIcon: false,
        type: 'success',
      }
    }, 1000)
  }
}
