import {ElementProperties} from './element-properties.interface';

export interface ElementMetaData<T> {
  label: string;
  slug: string;
  properties?: ElementProperties<T>;
}