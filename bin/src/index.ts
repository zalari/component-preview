#!/usr/bin/env node
import {options} from 'yargs';

const {argv} = options({
  config: {
    alias: 'c',
    describe: 'the config to use',
    default: 'preview.config.ts',
    string: true,
  },
  bundle: {
    alias: 'b',
    describe: 'a bundle to load components from',
    string: true,
  },
})
  .help('h')
  .alias('h', 'help')
  .epilog('Component Preview - © 2019 Zalari GmbH');

console.log('Hello World!', argv);

// read the config from given path
// read the config from default path (pwd/current running directory > preview.config.ts)

// create a config from the provided input in `src`

// start the stencil ui `npm start` > `stencil build --prod --serve`

// consume the dynamic config in stencil ui
