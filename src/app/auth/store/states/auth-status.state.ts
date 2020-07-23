import { Injectable } from '@angular/core'
import { Navigate } from '@ngxs/router-plugin'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { User } from '../../models/user.model'
import { LoginRedirect, LoginSuccess, Logout } from '../actions/auth.actions'

export interface AuthStatusStateModel {
  loggedIn: boolean
  user: User | null
}

const authStatusStateDefaults: AuthStatusStateModel = {
  loggedIn: false,
  user: null,
}

@State<AuthStatusStateModel>({
  name: 'status',
  defaults: authStatusStateDefaults,
})
@Injectable()
export class AuthStatusState {
  @Selector()
  static getLoggedIn(state: AuthStatusStateModel) {
    return state.loggedIn
  }

  @Selector()
  static getUser(state: AuthStatusStateModel) {
    return state.user
  }

  @Action(LoginSuccess)
  loginSuccess({ patchState }: StateContext<AuthStatusStateModel>, action: LoginSuccess) {
    patchState({
      loggedIn: true,
      user: action.payload.user,
    })
  }

  @Action([Logout, LoginRedirect])
  logout({ dispatch, setState }: StateContext<AuthStatusStateModel>) {
    setState(authStatusStateDefaults)

    dispatch(new Navigate(['/login']))
  }
}
