import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-drag-and-search',
  template: `
    <div class="button flex items-center justify-center" cdkDropList (cdkDropListDropped)="drop()">
      <div
        class="material-icons"
        cdkDragBoundary=".mapbox"
        cdkDrag
        [matTooltipPosition]="'below'"
        [matTooltip]="'Faite moi glisser où vous souhaiter aller'"
      >
        <div *cdkDragPlaceholder>
          <mat-progress-spinner [diameter]="15" [mode]="'indeterminate'"></mat-progress-spinner>
        </div>
        accessibility
      </div>
      <div class="icon" *cdkDragPreview></div>
    </div>
  `,
  styles: [
    `
      .button {
        height: 29px;
        width: 29px;
        margin: 10px 10px 0 0;
        background: #fff;
        float: right;
        border-radius: 4px;
        box-shadow: 0 0 0 2px rgb(0, 0, 0, 0.1);
        cursor: grab;
      }
      .button:active,
      .icon {
        cursor: url('/assets/icons/man.svg'), auto;
      }
      .button:hover {
        background: #f2f2f2;
      }
    `,
  ],
})
export class DragAndSearchComponent implements OnInit {
  @Output() dragEnd = new EventEmitter<void>()

  constructor() {}

  ngOnInit(): void {}

  drop() {
    this.dragEnd.emit()
  }
}
