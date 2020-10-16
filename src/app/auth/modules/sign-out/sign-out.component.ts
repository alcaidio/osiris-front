import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { interval, Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

@Component({
  selector: 'auth-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
  countdown = 4
  private sub = new Subject()

  constructor(private router: Router) {}

  ngOnInit(): void {

    const duration = this.countdown

    // Redirect after the countdown
    interval(1000)
      .pipe(take(duration), takeUntil(this.sub))
      .subscribe(
        () => {
          this.countdown--
        },
        () => {},
        () => {
          this.router.navigate(['sign-in'])
        }
      )
  }

  ngOnDestroy(): void {
    this.sub.next()
    this.sub.complete()
  }
}
