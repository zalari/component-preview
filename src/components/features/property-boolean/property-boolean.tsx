import {Component, Event, EventEmitter, Prop} from '@stencil/core';

@Component({
  tag: 'preview-property-boolean',
  styleUrl: 'property-boolean.scss',
  shadow: true,
})
export class PropertyBoolean {

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Prop()
  value: boolean;

  @Prop()
  label: string;

  @Event()
  change!: EventEmitter<boolean>;

  handleChange(event: Event) {
    const {checked} = event.target as HTMLInputElement;
    this.change.emit(checked);
  }

  render() {
    return (
      <preview-switch active={this.value}
                         darkTheme={this.darkTheme}
                         gridVisible={this.gridVisible}
                         onToggle={event => this.change.emit(event.detail)}
      >
        {this.label}
      </preview-switch>
    );
  }

}