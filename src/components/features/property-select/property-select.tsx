import {Component, Event, EventEmitter, Prop} from '@stencil/core';
import {PreviewOptions} from '../../../interfaces/preview-options.interface';
import {PreviewOptionValue} from '../../../types/preview-option-value.type';

@Component({
  tag: 'preview-property-select',
  styleUrl: 'property-select.scss',
  shadow: true,
})
export class PropertySelect {

  @Prop()
  value: PreviewOptionValue;

  @Prop()
  label: string;

  @Prop()
  options: PreviewOptions['options'] = [];

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Event()
  change!: EventEmitter<PreviewOptionValue>;

  handleChange(event: Event) {
    const {value} = event.target as HTMLSelectElement;
    this.change.emit(value);
  }

  getOption(option: PreviewOptions['options'][0]): [string, PreviewOptionValue] {
    let label = option;
    let value = option;

    if (typeof option === 'object') {
      if ('label' in option) {
        label = option.label;
      }
      if ('value' in option) {
        value = option.value;
      }
    }

    return [label as string, value as PreviewOptionValue];
  }

  render() {
    return (
      <select onChange={event => this.handleChange(event)}>
        {this.label && (
          <option disabled={true}
                  selected={this.value === undefined}
          >{this.label}</option>
        )}
        {this.options.length > 0 && this.options
          .map(option => this.getOption(option))
          .map(([label, value]) => (
            <option value={String(value)}
                    selected={value === this.value}
            >{label}</option>
          ))}
      </select>
    );
  }

}