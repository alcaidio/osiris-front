import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import * as Sentry from '@sentry/angular'
import { Integrations } from '@sentry/tracing'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

Sentry.init({
  dsn: 'https://f69db3235f6f4a8eae13c90287e027a2@o459279.ingest.sentry.io/5458160',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', 'https://yourserver.io/api'],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
