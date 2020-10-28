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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TranslocoModule } from '@ngneat/transloco'
import { TreoCardModule } from '@treo/components/card'
import { MouseWheelDirective } from './directives/mouse-wheel.directive';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'


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
  MatDialogModule
]

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslocoModule, TreoCardModule, MATERIAL],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, TranslocoModule, TreoCardModule, MouseWheelDirective, MATERIAL],
  declarations: [MouseWheelDirective, ConfirmDialogComponent],
})
export class SharedModule {}
