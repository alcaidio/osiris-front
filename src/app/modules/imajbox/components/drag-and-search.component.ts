import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-drag-and-search',
  template: `
    <div class="button flex items-center justify-center" cdkDropList (cdkDropListDropped)="drop()">
      <div
        class="material-icons"
        cdkDragBoundary=".mapbox"
        cdkDrag
        [matTooltipPosition]="'below'"
        [matTooltip]="tooltip === true ? 'Faite moi glisser où vous souhaiter aller' : ''"
      >
        <div *cdkDragPlaceholder>
          <svg width="20" height="22" viewBox="0 0 20 22" fill="#DDDDDD" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 0.9C9.81236 0.9 9.63014 0.924952 9.45658 0.971736L9.48261 1.06829C8.79645 1.25325 8.25325 1.79645 8.06829 2.48261L7.97174 2.45658C7.92495 2.63014 7.9 2.81236 7.9 3C7.9 3.18764 7.92495 3.36986 7.97174 3.54342L8.06829 3.51739C8.25325 4.20355 8.79645 4.74675 9.48261 4.93171L9.45658 5.02826C9.63014 5.07505 9.81236 5.1 10 5.1C10.1876 5.1 10.3699 5.07505 10.5434 5.02826L10.5174 4.93171C11.2035 4.74675 11.7468 4.20355 11.9317 3.51739L12.0283 3.54342C12.075 3.36986 12.1 3.18764 12.1 3C12.1 2.81236 12.075 2.63014 12.0283 2.45658L11.9317 2.48261C11.7468 1.79645 11.2035 1.25325 10.5174 1.06829L10.5434 0.971736C10.3699 0.924952 10.1876 0.9 10 0.9ZM19 8.1H19.1V8V7.66667H19V6.33333H19.1V6V5.9H19H18.5V6H16.5V5.9H15.5V6H13.5V5.9H12.5V6H10.5V5.9H9.5V6H7.5V5.9H6.5V6H4.5V5.9H3.5V6H1.5V5.9H1H0.9V6V6.33333H1V7.66667H0.9V8V8.1H1H1.5V8H3.5V8.1H4.5V8H6.5V8.1H6.9V8.54167H7V10.7083H6.9V11.7917H7V13.9583H6.9V15.0417H7V17.2083H6.9V18.2917H7V20.4583H6.9V21V21.1H7H7.33333V21H8.66667V21.1H9H9.1V21V20.5H9V18.5H9.1V17.5H9V15.5H9.1V15.1H9.33333V15H10.6667V15.1H10.9V15.5H11V17.5H10.9V18.5H11V20.5H10.9V21V21.1H11H11.3333V21H12.6667V21.1H13H13.1V21V20.4583H13V18.2917H13.1V17.2083H13V15.0417H13.1V13.9583H13V11.7917H13.1V10.7083H13V8.54167H13.1V8.1H13.5V8H15.5V8.1H16.5V8H18.5V8.1H19Z"
              stroke="black"
              stroke-width="0.5"
              stroke-dasharray="3 1"
            />
          </svg>
        </div>
        accessibility
      </div>
    </div>
  `,
  styles: [
    `
      .button {
        height: 29px;
        width: 29px;
        background: #fff;
        float: right;
        border-radius: 4px;
        box-shadow: 0 0 0 2px rgb(0, 0, 0, 0.1);
        cursor: grab;
      }
      .button:hover {
        background: #f2f2f2;
      }
    `,
  ],
})
export class DragAndSearchComponent implements OnInit {
  @Output() dragEnd = new EventEmitter<void>()
  @Input() tooltip = true

  constructor() {}

  ngOnInit(): void {}

  drop() {
    this.dragEnd.emit()
  }
}
