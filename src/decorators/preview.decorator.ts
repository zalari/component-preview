import {ComponentModule} from '@stencil/core/dist/declarations';
import {PreviewOptions} from '../interfaces/preview-options.interface';

export const PREVIEW_PROPS_KEY = '__previewProps';

export const Preview = (options: Partial<PreviewOptions> = {}): PropertyDecorator => {
  return (target, propertyKey) => {
    // add property to store the decorator data
    if (!(PREVIEW_PROPS_KEY in target)) {
      target[PREVIEW_PROPS_KEY] = {};
    }

    // prepare the meta data for properties
    if (!options.type) {
      const { properties } = target.constructor as ComponentModule;
      if (propertyKey in (properties as any)) {
        // derive the type information and map
        switch (typeof properties[propertyKey].type()) {
          case 'string':
          case 'symbol':
            options.type = 'string';
            break;

          case 'number':
          case 'bigint':
            options.type = 'number';
            break;

          case 'boolean':
            options.type = 'boolean';
            break;
        }
      }
    }

    // set name if missing
    if (!options.name) {
      options.name = String(propertyKey);
    }

    // add the meta data
    target[PREVIEW_PROPS_KEY][options.name] = options;
  };
};