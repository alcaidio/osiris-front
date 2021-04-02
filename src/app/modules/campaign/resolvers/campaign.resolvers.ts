import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { SetActive } from '@ngxs-labs/entity-state'
import { Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { Campaign, MapSmall } from '../model/campaign.model'
import { CampaignsState, GetOverlays, MapState } from '../store'
import { GetMap } from '../store/maps/maps.actions'

@Injectable()
export class MapSmallResolver implements Resolve<MapSmall> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.params.id // l'id de campaign = id de map
    return this.store.dispatch(new GetMap(id)).pipe(map(() => this.store.selectSnapshot(MapState.active)))
  }
}

@Injectable()
export class CampaignResolver implements Resolve<Campaign> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.params.id
    return this.store.dispatch(new SetActive(CampaignsState, id as string))
  }
}

@Injectable()
export class StatsResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.params.id
    return this.store.dispatch(new GetMap(id)).pipe(
      switchMap(() => {
        const mapSmall = this.store.selectSnapshot(MapState.active)
        return this.store.dispatch(new GetOverlays(mapSmall.id))
      })
    )
  }
}
