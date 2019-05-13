import {Component, Event, EventEmitter, Prop} from '@stencil/core';
import {ElementTagName} from '../../../classes/preview-store.class';
import {ElementMetaData} from '../../../interfaces/element-metadata.interface';
import {PreviewOptions} from '../../../interfaces/preview-options.interface';
import {PreviewOptionValue} from '../../../types/preview-option-value.type';

@Component({
  tag: 'preview-properties',
  styleUrl: 'properties.scss',
  shadow: true,
})
export class Properties {

  @Prop()
  activeTagName!: ElementTagName;

  @Prop()
  metadata!: ElementMetaData<Partial<PreviewOptions>>;

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Event()
  propertyChange!: EventEmitter<[string, any]>;

  handleChange(key: string, value: PreviewOptionValue) {
    this.propertyChange.emit([key, value]);
  }

  render() {
    const properties = this.metadata.properties || {};
    return Object
      .keys(properties)
      .map(key => {
        const {type, value, multi, options} = properties[key];
        switch (type) {
          case 'select':
            return (
              <so-preview-property-select label={key}
                                          options={options}
                                          darkTheme={this.darkTheme}
                                          gridVisible={this.gridVisible}
                                          value={(properties[key].default || value) as PreviewOptionValue}
                                          onChange={event => this.handleChange(key, event.detail)}
              />
            );

          case 'boolean':
            return (
              <so-preview-property-boolean label={key}
                                           value={(properties[key].default || value) as boolean}
                                           darkTheme={this.darkTheme}
                                           gridVisible={this.gridVisible}
                                           onChange={event => this.handleChange(key, event.detail)}
              />
            );

          case 'number':
          case 'string':
            return (
              <so-preview-property-text type={type}
                                        label={key}
                                        multi={multi}
                                        darkTheme={this.darkTheme}
                                        gridVisible={this.gridVisible}
                                        value={(properties[key].default || value) as string | number}
                                        onChange={event => this.handleChange(key, event.detail)}
              />
            );

          // default:
          //   return <span>{key} {type}</span>;
        }
      });
  }

}
