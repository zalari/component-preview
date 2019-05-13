import {PreviewOptionType} from '../types/preview-option-type.type';
import {PreviewOptionValue} from '../types/preview-option-value.type';

export interface PreviewOptions {
  name: string;
  multi: boolean;
  options: (PreviewOptionValue | { label: string; value: PreviewOptionValue})[];
  type: PreviewOptionType;
  default: PreviewOptionValue;
  value: PreviewOptionValue;
}
