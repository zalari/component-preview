import {Component, Event, EventEmitter, Prop} from '@stencil/core';

@Component({
  tag: 'preview-settings',
  styleUrl: 'settings.scss',
  shadow: true,
})
export class Settings {

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Event()
  themeChanged!: EventEmitter<boolean>;

  @Event()
  gridVisibilityChanged!: EventEmitter<boolean>;

  render() {

    return [
      <preview-switch active={this.darkTheme}
                         darkTheme={this.darkTheme}
                         gridVisible={this.gridVisible}
                         onToggle={event => this.themeChanged.emit(event.detail)}
      >
        {this.darkTheme && 'dark theme'}
        {!this.darkTheme && 'light theme'}
      </preview-switch>,
      <preview-switch active={this.gridVisible}
                         darkTheme={this.darkTheme}
                         gridVisible={this.gridVisible}
                         onToggle={event => this.gridVisibilityChanged.emit(event.detail)}
      >
        {this.gridVisible && 'grid on'}
        {!this.gridVisible && 'grid off'}
      </preview-switch>,
    ];
  }

}