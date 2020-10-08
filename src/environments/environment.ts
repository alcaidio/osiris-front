// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    api: {
      token: 'pk.eyJ1IjoidGltb3RoeTM0IiwiYSI6ImNrYjZreXRmNzB6NXAyeW16ZDFyYzFhdmcifQ.PP2qxB_gEEAh9XzZMEQm0g',
    },
  },
  osiris: {
    api: 'http://192.168.0.187:10002/api',
  },
  mapillary: {
    clientId: 'NkozRU9wNWZXUlU5SVVUQ0d3RlIzbzo0MTk5ODgyOWYwMmFiOTRl',
    images: 'https://images.mapillary.com',
    api: 'https://a.mapillary.com/v3',
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
