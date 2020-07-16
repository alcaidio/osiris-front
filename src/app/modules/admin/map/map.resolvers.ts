import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Section } from './models/map.model'
import { MapService } from './services/map.service'

@Injectable({
  providedIn: 'root',
})
export class MapSectionsResolver implements Resolve<any> {
  constructor(private _mapService: MapService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Section[]> {
    return this._mapService.getSections()
  }
}

@Injectable({
  providedIn: 'root',
})
export class MapSectionResolver implements Resolve<any> {
  constructor(private _mapService: MapService, private _router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Section> {
    return this._mapService.getSectionById(route.paramMap.get('id')).pipe(
      // Error here means the requested task is not available
      catchError((error) => {
        // Log the error
        console.error(error)

        // Get the parent url
        const parentUrl = state.url.split('/').slice(0, -1).join('/')

        // Navigate to there
        this._router.navigateByUrl(parentUrl)

        // Throw an error
        return throwError(error)
      })
    )
  }
}
