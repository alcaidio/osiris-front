import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { UserService } from 'app/layout/common/user/user.service'
import { User } from 'app/layout/common/user/user.types'
import { AuthStatusState } from 'app/modules/auth/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() showAvatar = true
  @Select(AuthStatusState.getEmail) email$: Observable<string>

  private _unsubscribeAll = new Subject()
  private _user: User

  constructor(private _router: Router, private _userService: UserService, private store: Store) {}

  @Input()
  set user(value: User) {
    this._user = value
    this._userService.user = value
  }

  get user(): User {
    return this._user
  }

  ngOnInit(): void {
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
      this._user = user
    })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }

  updateUserStatus(status): void {
    this.user.status = status
    this._userService.update(this.user)
  }

  onNavigate(url: string): void {
    this._router.navigate([url])
  }
}
