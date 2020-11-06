import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core'
import { Store } from '@ngxs/store'
import { TreoMediaWatcherService } from '@treo/services/media-watcher'
import { CloseDrawer, OpenDrawer } from '../store'


@Component({
  selector: 'app-map-drawer',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/map.component.scss'],
  template: `
  <div>
    <ng-container *ngIf="isLoading; else loaded">
      <mat-spinner class="m-auto" diameter="50"></mat-spinner>
    </ng-container>
    <ng-template #loaded>
      <div class="header flex items-center justify-between px-5 py-4 border-b">
        <div class="text-2xl font-medium">{{ title }}</div>
        <div class="-mr-3">
          <button *ngIf="isScreenSmall" mat-icon-button (click)="onClose()">
            <mat-icon>close</mat-icon>
          </button>
          <ng-container *ngIf="!isScreenSmall && !!icon">
            <button mat-icon-button (click)="onClick()">
              <mat-icon *ngIf="!!tooltip === true" [matTooltipPosition]="'below'" [matTooltip]="tooltip">
                {{ icon }}
              </mat-icon>
              <mat-icon *ngIf="!!tooltip === false">
                {{ icon }}
              </mat-icon>
            </button>
          </ng-container>
        </div>
      </div>
      <div class="content">
        <ng-content></ng-content>
      </div>
    </ng-template>
  </div>
  `
})
export class MapDrawerComponent implements OnInit, OnDestroy {
  @Input() isLoading: boolean
  @Input() title: string
  @Input() icon?: string
  @Input() tooltip?: string
  @Input() autoOpen = true
  @Output() action = new EventEmitter<any>()

  isScreenSmall: boolean

  constructor(private store: Store, private media: TreoMediaWatcherService) {}

  ngOnInit(): void {
    if (this.autoOpen) {
      setTimeout(() => {
        this.store.dispatch(new OpenDrawer())
      })
    }
    
    this.media.onMediaChange$.subscribe(({ matchingAliases }) => {
      this.isScreenSmall = matchingAliases.includes('xs')
    })    
  }

  onClick() {
    this.action.emit()
  }

  onClose(): void {
    this.store.dispatch(new CloseDrawer())
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CloseDrawer())
  }
}
