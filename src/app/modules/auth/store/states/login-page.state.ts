import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { catchError, map } from 'rxjs/operators'
import { AuthService } from '../../services/auth.service'
import { IsAuth, Login, LoginFailure, LoginSuccess } from '../actions/auth.actions'

export interface LoginPageStateModel {
  error: string | null
  pending: boolean
}

const loginPageStateDefault: LoginPageStateModel = {
  error: null,
  pending: false,
}

@State<LoginPageStateModel>({
  name: 'loginPage',
  defaults: loginPageStateDefault,
})
@Injectable()
export class LoginPageState {
  constructor(private authService: AuthService) {}

  @Selector()
  static getErrorMessage(state: LoginPageStateModel) {
    // see http core interceptor
    return state.error
  }

  @Selector()
  static getPending(state: LoginPageStateModel) {
    return state.pending
  }

  @Action(Login)
  login({ dispatch, patchState }: StateContext<LoginPageStateModel>, action: Login) {
    patchState({
      error: null,
      pending: true,
    })
    return this.authService.signIn(action.payload).pipe(
      map((res) => {
        dispatch(new IsAuth({ jwt: res['jwt'], login: action.payload.login }))
        dispatch(new LoginSuccess())
      }),
      catchError((error) => {
        return dispatch(new LoginFailure(error))
      })
    )
  }

  @Action(LoginSuccess)
  loginSuccess({ dispatch, patchState }: StateContext<LoginPageStateModel>) {
    patchState({
      error: null,
      pending: false,
    })

    dispatch(new Navigate(['/']))
  }

  @Action(LoginFailure)
  loginFailure({ patchState }: StateContext<LoginPageStateModel>, action: LoginFailure) {
    patchState({
      error: action.payload,
      pending: false,
    })
  }
}
