import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Store } from '@ngxs/store'
import { AuthStatusState } from 'app/modules/auth/store'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { ProfileForm } from '../models/settings.model'
import { SettingsService } from '../services/settings.service'

@Injectable()
export class FormsResolver implements Resolve<ProfileForm> {
  email: string

  constructor(private store: Store, private service: SettingsService) {
    this.email = this.store.selectSnapshot(AuthStatusState.getEmail)
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.getUserSettings(this.email).pipe(take(1))
  }
}
