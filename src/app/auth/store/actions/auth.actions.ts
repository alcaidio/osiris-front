import { Credentials } from '../../models/user.model'

export class Login {
  static readonly type = '[Auth] Login'
  constructor(public payload: Credentials) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success'
}

export class IsAuth {
  static readonly type = '[Auth] Is auth'
  constructor(public payload: string) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure'
  constructor(public payload: any) {}
}

export class LoginRedirect {
  static readonly type = '[Auth] Login Redirect'
}

export class Logout {
  static readonly type = '[Auth] Logout'
}
