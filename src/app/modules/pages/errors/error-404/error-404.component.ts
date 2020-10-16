import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Store } from '@ngxs/store'
import { AuthStatusState } from 'app/auth/store'

@Component({
  selector: 'error-404',
  templateUrl: './error-404.component.html',
  styleUrls: ['./error-404.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error404Component implements OnInit {
  location: string

  constructor(private store: Store) {}

  ngOnInit(): void {
    const authenticated = this.store.selectSnapshot(AuthStatusState.getLoggedIn)
    if (authenticated) {
      this.location = 'Map'
    } else {
      this.location = 'Home'
    }
  }

}
