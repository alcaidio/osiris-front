import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { init, routingInstrumentation } from '@sentry/angular'
import { Integrations } from '@sentry/tracing'
import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

init({
  dsn: 'https://88b6b20c7af148188ebd9c8fbfb8bdc7@o554131.ingest.sentry.io/5682276',
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    new Integrations.BrowserTracing({
      tracingOrigins: [
        'localhost',
        'http://192.168.0.187:8080/geoserver',
        'http://localhost:3000',
        'http://localhost:4200',
      ],
      routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
