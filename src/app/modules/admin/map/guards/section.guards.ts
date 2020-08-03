import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { SectionDetailsComponent } from './../containers/section-details.component'

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateSectionDetails implements CanDeactivate<SectionDetailsComponent> {
  canDeactivate(
    component: SectionDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root
    while (nextRoute.firstChild) {
      nextRoute = nextRoute.firstChild
    }

    // If the next state doesn't contain '/sections'
    // it means we are navigating away from the
    // sections route
    if (!nextState.url.includes('/sections')) {
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
      return component.closeDrawer().then(() => {
        return true
      })
    }
  }
}
