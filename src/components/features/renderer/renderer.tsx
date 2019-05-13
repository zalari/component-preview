import {Component, Prop} from '@stencil/core';
import {ElementMetaData} from '../../../interfaces/element-metadata.interface';
import {PreviewOptions} from '../../../interfaces/preview-options.interface';

@Component({
  tag: 'preview-renderer',
  styleUrl: 'renderer.scss',
  shadow: true,
})
export class Renderer {

  @Prop()
  activeTagName!: any;

  @Prop()
  metadata!: ElementMetaData<Partial<PreviewOptions>>;

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  getAttributesFromMetadata(properties: ElementMetaData<Partial<PreviewOptions>>['properties'] = {}) {
    return Object
      .keys(properties)
      .reduce((attributes, propertyKey) => {
        attributes[propertyKey] = properties[propertyKey].value || properties[propertyKey].default;
        return attributes;
      }, {});
  }

  render() {
    return (
      <div class="stage">
        {this.activeTagName && (
          <this.activeTagName {...this.getAttributesFromMetadata(this.metadata.properties)}
                              darkTheme={this.darkTheme}
                              gridVisible={this.gridVisible}
          />
        )}
      </div>
    );
  }

}
