import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { SectionInfosComponent } from '../containers/section-infos.component'

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateSectionDetails implements CanDeactivate<SectionInfosComponent> {
  canDeactivate(
    component: SectionInfosComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root
    while (nextRoute.firstChild) {
      nextRoute = nextRoute.firstChild
    }

    // If the next state doesn't contain '/section'
    // it means we are navigating away from the
    // sections route
    if (!nextState.url.includes('/section')) {
      // Let it navigate
      return true
    }

    // If we are navigating to another section...
    if (nextRoute.paramMap.get('id')) {
      // Just navigate
      return true
    }
    // Otherwise...
    else {
      // Close the drawer first, and then navigate
      return component.onClose().then(() => {
        return true
      })
    }
  }
}
