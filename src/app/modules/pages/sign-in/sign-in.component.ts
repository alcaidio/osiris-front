import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Select, Store } from '@ngxs/store'
import { Login } from 'app/modules/auth/store'
import { Observable, Subscription } from 'rxjs'
import { TreoAnimations } from '../../../../@treo/animations/public-api'
import { LoginPageState } from '../../auth/store/'

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
  passwordPlaceholder = '**********'
  private sub = new Subscription()

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.setupForm()
  }

  onSignIn(): void {
    const credentials = this.loginForm.value
    if (credentials['rememberMe']) {
      this.remember(credentials['login'])
    }
    this.store.dispatch(new Login(credentials))
  }

  onPressLogin(): void {
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

  get login() {
    return this.loginForm.get('login')
  }

  get password() {
    return this.loginForm.get('password')
  }

  private setupForm() {
    this.loginForm = this.fb.group({
      login: [this.loginInStorage(), [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [''],
    })
  }

  private remember(login: string): void {
    localStorage.setItem('login.remember', login)
  }

  private loginInStorage() {
    const login = localStorage.getItem('login.remember')
    if (login) {
      return login
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
