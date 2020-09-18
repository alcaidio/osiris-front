import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Select, Store } from '@ngxs/store'
import { Login, LoginPageState } from 'app/auth/store'
import { Observable, Subscription } from 'rxjs'
import { TreoAnimations } from '../../../../@treo/animations/public-api'

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: TreoAnimations,
})
export class AuthSignInComponent implements OnInit, OnDestroy {
  @Select(LoginPageState.getErrorMessage) message$: Observable<string>
  @Select(LoginPageState.getPending) pending$: Observable<boolean>
  @ViewChild('passwordField') passwordField: ElementRef

  loginForm: FormGroup
  private sub = new Subscription()
  passwordPlaceholder = '**********'

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.setupForm()
  }

  onSignIn(): void {
    const credentials = this.loginForm.value
    if (credentials['rememberMe']) {
      this.remember(credentials['email'])
    }
    this.store.dispatch(new Login(credentials))
  }

  onPressEmail(): void {
    this.passwordField.nativeElement.focus()
  }

  onSwitchPasswordIcon(passwordField: HTMLInputElement): void {
    if (passwordField.type === 'password') {
      passwordField.type = 'text'
      this.passwordPlaceholder = 'password'
    } else {
      passwordField.type = 'password'
      this.passwordPlaceholder = '**********'
    }
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  private setupForm() {
    this.loginForm = this.fb.group({
      email: [this.emailInStorage(), [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [''],
    })
  }

  private remember(email: string): void {
    localStorage.setItem('email.remember', email)
  }

  private emailInStorage() {
    const email = localStorage.getItem('email.remember')
    if (email) {
      return email
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
