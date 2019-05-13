import {Component, ComponentDidLoad, Element, Event, EventEmitter, Prop, Watch} from '@stencil/core';

@Component({
  tag: 'preview-property-text',
  styleUrl: 'property-text.scss',
  shadow: true,
})
export class PropertyText implements ComponentDidLoad {

  @Prop()
  type: 'string' | 'number';

  @Prop()
  value: string | number;

  @Prop()
  multi: boolean;

  @Prop()
  label: string;

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Event()
  change!: EventEmitter<string | number>;

  @Element()
  private _elementRef!: HTMLPreviewPropertyTextElement;

  @Watch('multi')
  setMultiline() {
    this._elementRef.classList.toggle('is-multiline', this.multi);
  }

  handleChange(event: Event) {
    const {value} = event.target as HTMLInputElement;
    this.change.emit(value as string | number);
  }

  componentDidLoad() {
    // kick-start watchers
    this.setMultiline();
  }

  render() {
    if (this.multi) {
      return (
        <textarea placeholder={this.label}
                  onInput={event => this.handleChange(event)}
        >{String(this.value).trim()}</textarea>
      );
    } else {
      return (
        <input type={this.type === 'string' ? 'text' : this.type}
               value={this.value}
               placeholder={this.label}
               onInput={event => this.handleChange(event)}
        />
      );
    }
  }

}