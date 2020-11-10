import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-drawer-sidenav',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./_styles.component.scss'],
  template: `
    <div class="h-full">
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
    </div>
  `,
})
export class DrawerSidenavComponent {
  @Input() title: string
  @Input() icon?: string
  @Input() tooltip?: string
  @Input() isScreenSmall: boolean
  @Output() action = new EventEmitter<any>()
  // tslint:disable-next-line: no-output-native
  @Output() close = new EventEmitter<boolean>()

  onClick() {
    this.action.emit()
  }

  onClose(): void {
    this.close.emit()
  }
}
