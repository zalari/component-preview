// import {PreviewStore} from '@zalari/component-preview';
import {PreviewStore} from '../../src/classes/preview-store.class';

export const config = (store: PreviewStore) => {
  store.addElement('example-hello-world', {
    label: 'Hello World Example',
    slug: 'hello-world',
    bundle: 'index.js',
    properties: {}
  })
};
