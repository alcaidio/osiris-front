import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule, Optional, SkipSelf } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin'
import { NgxsRouterPluginModule } from '@ngxs/router-plugin'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { NgxsModule } from '@ngxs/store'
import { environment } from 'environments/environment'
import { AuthModule } from './../modules/auth/auth.module'
import { AuthInterceptor } from './interceptors/auth.interceptor'
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor'
import { AppStates } from './store'

@NgModule({
  imports: [
    HttpClientModule,
    AuthModule,
    NgxsModule.forRoot(AppStates, {
      developmentMode: !environment.production,
    }),
    NgxsStoragePluginModule.forRoot({
      key: ['auth.status.jwt', 'auth.status.loggedIn', 'auth.status.email', 'auth.status.organizationKeyName'], // add some to cache store after reload
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'Osiris Store DevTools',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  /**
   * Constructor
   *
   * @param {DomSanitizer} _domSanitizer
   * @param {MatIconRegistry} _matIconRegistry
   * @param parentModule
   */
  constructor(
    private _domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    @Optional() @SkipSelf() parentModule?: CoreModule
  ) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.')
    }

    // Register icon sets
    this._matIconRegistry.addSvgIconSet(
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg')
    )
    this._matIconRegistry.addSvgIconSetInNamespace(
      'mat_outline',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg')
    )
    this._matIconRegistry.addSvgIconSetInNamespace(
      'iconsmind',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/iconsmind.svg')
    )
    this._matIconRegistry.addSvgIconSetInNamespace(
      'dripicons',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/dripicons.svg')
    )
    this._matIconRegistry.addSvgIconSetInNamespace(
      'feather',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg')
    )
    this._matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_outline',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg')
    )
    this._matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_solid',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg')
    )
  }
}
