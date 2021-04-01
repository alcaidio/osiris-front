import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router'
import { Navigate } from '@ngxs/router-plugin'
import { Select, Store } from '@ngxs/store'
import { Observable, of } from 'rxjs'
import { AuthStatusState } from '../store'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  @Select(AuthStatusState.getLoggedIn) isLoggedIn$: Observable<boolean>

  constructor(private store: Store) {}

  // TODO add if token expired
  private _check(): Observable<boolean> {
    const authenticated = this.store.selectSnapshot(AuthStatusState.getLoggedIn)

    if (!authenticated) {
      this.store.dispatch(new Navigate(['sign-in']))
      return of(false)
    }
    return of(true)
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check()
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._check()
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._check()
  }
}
