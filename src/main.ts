import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { init } from '@sentry/angular'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

init({
  dsn: 'https://88b6b20c7af148188ebd9c8fbfb8bdc7@o554131.ingest.sentry.io/5682276',
})

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
