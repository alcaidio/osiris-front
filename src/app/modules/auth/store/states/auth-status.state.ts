import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { AuthUtils } from '../../auth.utils'
import { LoginRedirect, Logout } from '../actions/auth.actions'
import { IsAuth } from './../actions/auth.actions'

export interface AuthStatusStateModel {
  loggedIn: boolean
  jwt: string | null
  email: string | null
  organizationKeyName: string | null
}

const authStatusStateDefaults: AuthStatusStateModel = {
  loggedIn: false,
  jwt: null,
  email: null,
  organizationKeyName: null,
}

@State<AuthStatusStateModel>({
  name: 'status',
  defaults: authStatusStateDefaults,
})
@Injectable()
export class AuthStatusState {
  @Selector()
  static getOrganizationKeyName(state: AuthStatusStateModel): string | null {
    return state.organizationKeyName
  }

  @Selector()
  static getLoggedIn(state: AuthStatusStateModel): boolean {
    return state.loggedIn
  }

  @Selector()
  static getJWT(state: AuthStatusStateModel): string {
    return state.jwt
  }

  @Selector()
  static getEmail(state: AuthStatusStateModel): string {
    return state.email
  }

  @Action(IsAuth)
  isAuth({ patchState }: StateContext<AuthStatusStateModel>, action: IsAuth) {
    const decryptedToken = AuthUtils.getOrganizationKeyName(action.payload.jwt)
    const organizationKeyName = decryptedToken['org_key_name']
    console.log(organizationKeyName)
    patchState({
      loggedIn: true,
      jwt: action.payload.jwt,
      email: action.payload.login,
      organizationKeyName,
    })
  }

  @Action([Logout, LoginRedirect])
  logout({ setState }: StateContext<AuthStatusStateModel>) {
    localStorage.removeItem('auth.status.jwt')
    setState(authStatusStateDefaults)
  }
}
