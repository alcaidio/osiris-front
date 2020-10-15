import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TreoNavigationModule } from '@treo/components/navigation'
import { MessagesModule } from 'app/layout/common/messages/messages.module'
import { NotificationsModule } from 'app/layout/common/notifications/notifications.module'
import { SearchModule } from 'app/layout/common/search/search.module'
import { ShortcutsModule } from 'app/layout/common/shortcuts/shortcuts.module'
import { UserModule } from 'app/layout/common/user/user.module'
import { CompactLayoutComponent } from 'app/layout/layouts/vertical/compact/compact.component'
import { SharedModule } from 'app/shared/shared.module'

@NgModule({
  declarations: [CompactLayoutComponent],
  imports: [
    HttpClientModule,
    RouterModule,
    TreoNavigationModule,
    MessagesModule,
    NotificationsModule,
    SearchModule,
    ShortcutsModule,
    UserModule,
    SharedModule,
  ],
  exports: [CompactLayoutComponent],
})
export class CompactLayoutModule {}
