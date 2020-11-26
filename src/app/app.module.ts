import { CommonModule } from '@angular/common'
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { TranslocoConfig, TranslocoModule, TRANSLOCO_CONFIG } from '@ngneat/transloco'
import { RouterStateSerializer } from '@ngxs/router-plugin'
import * as Sentry from '@sentry/angular'
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
import { AppRoutingModule } from './app.routing'
import { httpLoader } from './core/i18n/transloco.loader'
import { CustomRouterStateSerializer } from './core/store/states/router.state.serializer'
import { SharedModule } from './shared/shared.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TreoModule,
    TreoConfigModule.forRoot(appConfig),
    TreoMockApiModule.forRoot(mockDataServices),
    LayoutModule,
    CoreModule,
    SharedModule,
    MarkdownModule.forRoot({}),
  ],
  providers: [
    httpLoader,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ['fr', 'en'],
        reRenderOnLangChange: true,
        prodMode: environment.production,
      } as TranslocoConfig,
    },
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
  bootstrap: [AppComponent],
  exports: [TranslocoModule],
})
export class AppModule {}
