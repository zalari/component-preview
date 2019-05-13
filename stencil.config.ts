import {Config} from '@stencil/core';
import {sass} from '@stencil/sass';

export const config: Config = {
  namespace: 'component-preview',
  preamble: '© 2019 Zalari GmbH',
  outputTargets: [
    {type: 'docs'},
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  globalStyle: 'src/styles/global.scss',
  plugins: [
    sass({
      includePaths: ['./node_modules'],
      importer: url => ({file: url.replace(/^~/, './node_modules/')}),
    }),
  ],
};
