import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { SetActive } from '@ngxs-labs/entity-state'
import { Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { Campaign, MapSmall } from '../model/shared.model'
import { ApiService } from '../services/api.service'
import { CampaignsState, MapState } from '../store'
import { GetMap } from '../store/maps/maps.actions'

@Injectable({
  providedIn: 'root',
})
export class MapSmallResolver implements Resolve<MapSmall> {
  constructor(private store: Store, private service: ApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.params.id
    return this.service.getCampaign(id).pipe(
      switchMap((campaign) => {
        return this.store
          .dispatch(new GetMap(campaign.mapId))
          .pipe(map(() => this.store.selectSnapshot(MapState.active)))
      }),
      catchError((err) => {
        console.log('Error: ', err)
        return this.router.navigate(['..'])
      })
    )
  }
}

@Injectable({
  providedIn: 'root',
})
export class CampaignResolver implements Resolve<Campaign> {
  constructor(private store: Store, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.params.id

    return this.store.dispatch(new SetActive(CampaignsState, id as string)).pipe(
      catchError((err) => {
        console.log('Error: ', err)
        return this.router.navigate(['..'])
      })
    )
  }
}
