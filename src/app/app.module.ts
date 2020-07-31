import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslocoConfig, TRANSLOCO_CONFIG } from '@ngneat/transloco'
import { RouterStateSerializer } from '@ngxs/router-plugin'
import { TreoModule } from '@treo'
import { TreoMockApiModule } from '@treo/lib/mock-api'
import { TreoConfigModule } from '@treo/services/config'
import { AppComponent } from 'app/app.component'
import { appConfig } from 'app/core/config/app.config'
import { CoreModule } from 'app/core/core.module'
import { mockDataServices } from 'app/data/mock'
import { LayoutModule } from 'app/layout/layout.module'
import { environment } from 'environments/environment'
import { MarkdownModule } from 'ngx-markdown'
import { AppRoutingModule, CustomRouterStateSerializer } from './app.routing'
import { httpLoader } from './core/i18n/transloco.loader'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Treo & Treo Mock API
    TreoModule,
    TreoConfigModule.forRoot(appConfig),
    TreoMockApiModule.forRoot(mockDataServices),

    // Core
    CoreModule,

    // Layout
    LayoutModule,

    // 3rd party modules
    MarkdownModule.forRoot({}),
  ],
  providers: [
    httpLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        prodMode: environment.production,
        availableLangs: [
          { id: 'en', label: 'English' },
          { id: 'fr', label: 'French' },
        ],
        reRenderOnLangChange: true,
        defaultLang: 'fr',
      } as TranslocoConfig,
    },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
