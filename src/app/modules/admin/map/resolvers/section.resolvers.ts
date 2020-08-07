import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { Layer } from 'mapbox-gl'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { DiagService } from '../services/diag.service'

@Injectable({
  providedIn: 'root',
})
export class LayersResolver implements Resolve<any> {
  constructor(private diagService: DiagService) {}

  resolve(): Observable<Layer[]> {
    return this.diagService.getLayers()
  }
}

@Injectable({
  providedIn: 'root',
})
export class SectionResolver implements Resolve<any> {
  constructor(private router: Router, private diagService: DiagService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id')
    return this.diagService.getSectionById(id).pipe(
      catchError((error) => {
        console.error(error)
        const parentUrl = state.url.split('/').slice(0, -1).join('/')
        this.router.navigateByUrl(parentUrl)
        return throwError(error)
      })
    )
  }
}
