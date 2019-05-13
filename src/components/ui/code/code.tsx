import {Component, ComponentDidLoad, Prop, State, Watch} from '@stencil/core';

import {ElementTagName} from '../../../classes/preview-store.class';
import {ElementMetaData} from '../../../interfaces/element-metadata.interface';
import {PreviewOptions} from '../../../interfaces/preview-options.interface';

@Component({
  tag: 'preview-code',
  styleUrl: 'code.scss',
  shadow: true,
})
export class Code implements ComponentDidLoad {

  @Prop({context: 'window'})
  private readonly _window: Window;

  previewRef: HTMLPreElement;

  @Prop()
  activeTagName!: ElementTagName;

  @Prop()
  metadata!: ElementMetaData<Partial<PreviewOptions>>;

  @Prop()
  indent = 2;

  @Prop()
  indentWith: ' ' | '\t' = ' ';

  @State()
  copyLabel = 'copy';

  @State()
  private _properties: string[] = [];

  @State()
  private _content: string[] = [];

  private _resetLabel: number | undefined;

  get hasContent(): boolean {
    return 'properties' in this.metadata
      && 'innerHTML' in this.metadata.properties
      && 'value' in this.metadata.properties.innerHTML
      && typeof this.metadata.properties.innerHTML.value === 'string';
  }

  get hasProperties(): boolean {
    return 'properties' in this.metadata && (
      (!this.hasContent && Object.keys(this.metadata.properties).length > 0)
      || (this.hasContent && Object.keys(this.metadata.properties).length > 1)
    );
  }

  @Watch('metadata')
  prepareFromMetadata() {
    if (this.hasProperties) {
      this._properties = this._prepareProperties();
    }
    if (this.hasContent) {
      this._content = this._prepareContent();
    }
  }

  componentDidLoad() {
    // kick-start watchers
    this.prepareFromMetadata();
  }

  copyToClipboard() {
    const document = this._window.document;

    // select the text
    let selection;
    let range;
    if (this._window.getSelection && document.createRange) {
      selection = this._window.getSelection();
      range = document.createRange();
      range.selectNodeContents(this.previewRef);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if ('createTextRange' in document.body) {
      range = (document.body['createTextRange'] as Function)();
      range.moveToElementText(this.previewRef);
      range.select();
    }

    // paste to clipboard
    document.execCommand('copy');

    // notify using the button label
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout#Notes
    this.copyLabel = 'copied!';
    this._window.clearTimeout(this._resetLabel);
    this._resetLabel = this._window.setTimeout(() => this.copyLabel = 'copy', 2000);
  }

  renderOpeningTag(): string {
    const properties = [...this._properties];
    let openingTag = `<${this.activeTagName}`;

    // add properties
    if (properties.length) {
      openingTag += this._withIndention(properties.shift(), ' ');
    }

    // add remaining properties
    if (properties.length) {
      const indention = ' '.repeat(this.activeTagName.length + 2);
      openingTag += '\n';
      openingTag += properties
        .map(prop => this._withIndention(prop, indention))
        .join('\n');
      openingTag += '\n';
    }

    // close the tag
    openingTag += '>';

    return openingTag;
  }

  renderContent(): string {
    return this._content
      .map(content => this._withIndention(content))
      .join('\n');
  }

  renderCode(): string {
    const code = new Set();

    // opening tag
    code.add(this.renderOpeningTag());

    // eventually slotted content
    if (this.hasContent) {
      code.add(this.renderContent());
    }

    // closing tag
    code.add(`</${this.activeTagName}>`);

    // put it all together
    return Array.from(code).join(code.size > 2 ? '\n' : '');
  }

  render() {
    return [
      <button onClick={() => this.copyToClipboard()}>{this.copyLabel}</button>,
      <pre ref={element => this.previewRef = element}>{this.renderCode()}</pre>
    ];
  }

  private _withIndention(code: string, indention?: string): string {
    if (!indention) {
      indention = this.indentWith.repeat(this.indent);
    }
    return indention + code;
  }

  private _prepareProperties(): string[] {
    const {properties} = this.metadata;
    return Object
      .keys(properties)
      .filter(prop => prop !== 'innerHTML')
      .map(prop => `${prop}="${properties[prop].value || properties[prop].default}"`);
  }

  private _prepareContent(): string[] {
    return this.metadata.properties.innerHTML.value.toString()
      .split('\n')
      .filter(content => content.trim() !== '');
  }

}