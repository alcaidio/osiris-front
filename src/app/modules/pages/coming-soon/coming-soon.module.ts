import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TreoCardModule } from '@treo/components/card'
import { ComingSoonComponent } from 'app/modules/pages/coming-soon/coming-soon.component'
import { comingSoonRoutes } from 'app/modules/pages/coming-soon/coming-soon.routing'
import { SharedModule } from 'app/shared/shared.module'

@NgModule({
  declarations: [ComingSoonComponent],
  imports: [
    RouterModule.forChild(comingSoonRoutes),
    TreoCardModule,
    SharedModule,
  ],
})
export class ComingSoonModule {}
