import {Config} from '@stencil/core';
import {sass} from '@stencil/sass';

export const config: Config = {
  namespace: 'component-preview',
  preamble: '© 2019 Zalari - Unlicensed',
  outputTargets: [
    {type: 'dist'},
    {type: 'docs'},
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  globalStyle: 'src/styles/global.scss',
  devServer: {
    port: 3006,
  },
  plugins: [
    sass({
      includePaths: ['./node_modules'],
      importer: url => ({file: url.replace(/^~/, './node_modules/')}),
    }),
  ],
};
