import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { Credentials } from './../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = environment.osiris.api

  constructor(private http: HttpClient) {}

  signIn(credentials: Credentials): Observable<string> {
    return this.http.post<string>(`${this.api}/auth/login`, credentials)
  }

  forgottenPasswordRequest(email: string): Observable<string> {
    return this.http.post<string>(`${this.api}/auth/forgottenpassword/mail-request`, email)
  }

  forgottenPasswordValidation(body: { email: string; uuid: string }): Observable<string> {
    return this.http.post<string>(`${this.api}/auth/forgottenpassword/uuid-validation`, body)
  }

  forgottenPasswordReset(body: { email: string; uuid: string; newPassword: string }): Observable<string> {
    return this.http.post<string>(`${this.api}/auth/forgottenpassword/reset`, body)
  }

  // TODO : do a refresh token
  //
  // /**
  //  * Sign in using the access token
  //  */
  // signInUsingToken(): Observable<any> {
  //   // Renew token
  //   return this._httpClient
  //     .post('api/auth/refresh-access-token', {
  //       access_token: this.accessToken,
  //     })
  //     .pipe(
  //       catchError(() => {
  //         return of(false)
  //       }),
  //       switchMap((response: any) => {
  //         this.accessToken = response.access_token
  //         this._authenticated = true
  //         return of(true)
  //       })
  //     )
  // }
}
