import {Component, Event, EventEmitter, Listen, Prop} from '@stencil/core';

@Component({
  tag: 'preview-switch',
  styleUrl: 'switch.scss',
  shadow: true,
})
export class Switch {

  @Prop()
  disabled: boolean;

  @Prop({mutable: true, reflectToAttr: true})
  active = false;

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Event()
  toggle!: EventEmitter<boolean>;

  @Listen('click')
  handleClick() {
    this.active = !this.active;
    this.toggle.emit(this.active);
  }

  render() {
    return (
      <slot />
    );
  }

}
