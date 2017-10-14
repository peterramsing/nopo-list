// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyByuiKIkDWrYuvfCfzVynVnCKbc2sNpnH4',
    authDomain: 'nopo-list.firebaseapp.com',
    databaseURL: 'https://nopo-list.firebaseio.com',
    projectId: 'nopo-list',
    storageBucket: 'nopo-list.appspot.com',
    messagingSenderId: '11677452771',
  },
};
