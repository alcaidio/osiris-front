import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { RouterModule } from '@angular/router'
import { TreoCardModule } from '@treo/components/card'
import { TreoMessageModule } from '@treo/components/message'
import { ComingSoonComponent } from 'app/modules/pages/coming-soon/coming-soon.component'
import { comingSoonRoutes } from 'app/modules/pages/coming-soon/coming-soon.routing'
import { SharedModule } from 'app/shared/shared.module'

@NgModule({
  declarations: [ComingSoonComponent],
  imports: [
    RouterModule.forChild(comingSoonRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TreoCardModule,
    TreoMessageModule,
    SharedModule,
  ],
})
export class ComingSoonModule {}
