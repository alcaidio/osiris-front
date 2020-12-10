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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TranslocoModule } from '@ngneat/transloco'
import { TreoCardModule } from '@treo/components/card'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { environment } from './../../environments/environment'
import { BuildingsLayerComponent } from './components/buildings-layer.component'
import { TemplateOneComponent } from './components/template-one.component'
import { TemplateThreeComponent } from './components/template-three.component'
import { TemplateTwoComponent } from './components/template-two.component'
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
]

@NgModule({
  declarations: [
    MouseWheelDirective,
    TemplateOneComponent,
    TemplateTwoComponent,
    BuildingsLayerComponent,
    TemplateThreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    TreoCardModule,
    MATERIAL,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.api.token,
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TemplateOneComponent,
    TemplateTwoComponent,
    TranslocoModule,
    TreoCardModule,
    MouseWheelDirective,
    BuildingsLayerComponent,
    TemplateThreeComponent,
    MATERIAL,
  ],
})
export class SharedModule {}
