import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select } from '@ngxs/store'
import { AuthStatusState } from 'app/modules/auth/store'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'

@AutoUnsubscribe()
@Component({
  selector: 'coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  @Select(AuthStatusState.getEmail) email$: Observable<string>
  isLoading: boolean
  featureName: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = false
    this.route.data.subscribe((e) => (this.featureName = e.title))
  }

  ngOnDestroy(): void {
    // because of @AutoUnsubscribe()
  }
}
