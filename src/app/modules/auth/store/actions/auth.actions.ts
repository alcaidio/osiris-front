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
  constructor(public payload: { jwt: string; login: string }) {}
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

// export class RequestForgottenPassword {
//   static readonly type = '[Auth] Request forgotten password email'
//   constructor(public email: string) {}
// }

// export class ResetForgottenPassword {
//   static readonly type = '[Auth] Reset forgotten password'
//   constructor(public payload: { email: string; uuid: string; newPassword: string }) {}
// }

// export class ValidationForgottenPassword {
//   static readonly type = '[Auth] Forgotten password validation'
//   constructor(public payload: { email: string; uuid: string }) {}
// }
