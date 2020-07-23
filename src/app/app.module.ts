import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router'
import { TranslocoConfig, TRANSLOCO_CONFIG } from '@ngneat/transloco'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin'
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin'
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { NgxsModule } from '@ngxs/store'
import { TreoModule } from '@treo'
import { TreoMockApiModule } from '@treo/lib/mock-api'
import { TreoConfigModule } from '@treo/services/config'
import { AppComponent } from 'app/app.component'
import { appRoutes } from 'app/app.routing'
import { appConfig } from 'app/core/config/app.config'
import { CoreModule } from 'app/core/core.module'
import { mockDataServices } from 'app/data/mock'
import { LayoutModule } from 'app/layout/layout.module'
import { environment } from 'environments/environment'
import { MarkdownModule } from 'ngx-markdown'
import { CustomRouterStateSerializer } from './app.routing'
import { httpLoader } from './core/i18n/transloco.loader'

const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: PreloadAllModules,
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),

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

    // Ngxs store
    NgxsModule.forRoot(), // TODO
    NgxsStoragePluginModule.forRoot({
      key: [], // TODO
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'Osiris Store DevTools',
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
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
