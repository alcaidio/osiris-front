import { OverlayModule } from '@angular/cdk/overlay'
import { PortalModule } from '@angular/cdk/portal'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TRANSLOCO_SCOPE } from '@ngneat/transloco'
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component'
import { SharedModule } from 'app/shared/shared.module'

@NgModule({
  declarations: [ShortcutsComponent],
  imports: [
    RouterModule,
    OverlayModule,
    PortalModule,
    SharedModule
  ],
  exports: [ShortcutsComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'shortcuts' }]
})
export class ShortcutsModule {}
