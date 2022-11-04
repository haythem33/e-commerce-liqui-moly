// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server_url: 'http://localhost:3000',
  firebase_config: {
    apiKey: 'AIzaSyCZXoEWYAqbrBGSSJeeO3itP2hWIZWeD20',
    authDomain: 'liquimoly-871fd.firebaseapp.com',
    projectId: 'liquimoly-871fd',
    storageBucket: 'liquimoly-871fd.appspot.com',
    messagingSenderId: '978005805119',
    appId: '1:978005805119:web:881300173640118e80108a',
    measurementId: 'G-V9NZM62J2T',
  },
  paymeeConfig: {
    api_url: 'https://sandbox.paymee.tn',
    token: 'c0d2bbb79dabe9eac33f9df4cb9fbca75433e291',
    accountNum: 2529,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
