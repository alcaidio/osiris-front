import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { LoadSectionWithId } from './store'

@Injectable({
  providedIn: 'root',
})
export class SectionResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = +route.params.id
    this.store.dispatch(new LoadSectionWithId(id)).pipe(take(1))
  }
}
