import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatTooltipModule } from '@angular/material/tooltip'
import { BrowserModule } from '@angular/platform-browser'
import { TranslocoModule } from '@ngneat/transloco'
import { TreoCardModule } from '@treo/components/card'
import { MouseWheelDirective } from './directives/mouse-wheel.directive'

const MATERIAL = [
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatSidenavModule,
  MatTooltipModule,
  MatDividerModule,
  MatCheckboxModule,
  MatListModule,
  MatSnackBarModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatInputModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatBadgeModule,
  MatDialogModule,
  MatRadioModule,
  DragDropModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressBarModule,
]

@NgModule({
  declarations: [MouseWheelDirective],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    TreoCardModule,
    ...MATERIAL,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    TreoCardModule,
    MouseWheelDirective,
    ...MATERIAL,
  ],
})
export class SharedModule {}
