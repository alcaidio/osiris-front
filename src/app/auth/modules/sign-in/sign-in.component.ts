import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Select, Store } from '@ngxs/store'
import { Login, LoginPageState } from 'app/auth/store'
import { Observable } from 'rxjs'
import { TreoAnimations } from '../../../../@treo/animations/public-api'

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: TreoAnimations,
})
export class AuthSignInComponent implements OnInit {
  @Select(LoginPageState.getErrorMessage) message$: Observable<string>
  signInForm: FormGroup

  constructor(private _formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email: ['admin@immergis.fr'],
      password: ['admin'],
      rememberMe: [''],
    })
  }

  onSignIn(): void {
    // TODO : add form in the store
    // FIX : disable is present during an error
    this.signInForm.disable()
    const credentials = this.signInForm.value
    this.store.dispatch(new Login(credentials))
  }
}
