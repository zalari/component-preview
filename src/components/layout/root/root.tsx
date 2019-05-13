import {Component, ComponentDidLoad, ComponentDidUnload, ComponentWillLoad, Prop, State, Watch} from '@stencil/core';
import {Action, createBrowserHistory, Location, UnregisterCallback} from 'history';

import '../../../preview.config';

import {ElementSlug, ElementStore, ElementTagName, PreviewStore} from '../../../classes/preview-store.class';
import {ElementMetaData} from '../../../interfaces/element-metadata.interface';
import {PreviewOptions} from '../../../interfaces/preview-options.interface';
import {PreviewPaths} from '../../../types/preview-paths.type';
import {PreviewOptionValue} from '../../../types/preview-option-value.type';

import {getSlugFromPathname, getTagNameFromPathname} from '../../../utils/path.utils';

@Component({
  tag: 'preview-root',
  styleUrl: 'preview.scss',
  shadow: true,
})
export class Root implements ComponentWillLoad, ComponentDidLoad, ComponentDidUnload {

  readonly history = createBrowserHistory();

  @State()
  readonly components: ElementStore = new Map();

  @State()
  readonly paths: PreviewPaths = new Map();

  @Prop({mutable: true, reflectToAttr: true})
  darkTheme = false;

  @Prop({mutable: true, reflectToAttr: true})
  gridVisible = true;

  @State()
  activeTagName: ElementTagName | undefined;

  @State()
  activeSlug: ElementSlug | undefined;

  @State()
  metadata: ElementMetaData<Partial<PreviewOptions>>;

  get hasActiveComponent(): boolean {
    return this.components.has(this.activeTagName)
      && this.components.get(this.activeTagName).has(this.activeSlug);
  }

  private _unregisterLocationListener: UnregisterCallback;

  @Watch('activeTagName')
  @Watch('activeSlug')
  updateMetadata() {
    if (this.hasActiveComponent) {
      this.metadata = this.components.get(this.activeTagName).get(this.activeSlug);
    }
  }

  async componentWillLoad() {
    // listen to the preview store and update components
    // map from currently registered elements in store
    PreviewStore.addListener(elements => {
      elements.forEach((previews, tagName) => {
        const _previews = new Map(Array.from(previews));
        // add missing components
        if (!this.components.has(tagName)) {
          console.info(`%c added ${tagName}`, 'color: lightgreen');
          this.components.set(tagName, _previews);
        }
        // add missing paths
        if (!this.paths.has(tagName)) {
          this.paths.set(tagName, { label: tagName });
        }
        // add missing slugs
        _previews.forEach(({ slug, label }) => {
          if (!('paths' in this.paths.get(tagName))) {
            this.paths.get(tagName).paths = new Map();
          }

          if (!this.paths.get(tagName).paths.has(slug)) {
            console.info(`%c added ${label} [${slug}]`, 'color: green');
            this.paths.get(tagName).paths.set(slug, { label });
          }
        });
      });
    });
  }

  onLocationChanged(location: Location, action: Action) {
    // do not track the 'POP' actions
    if (action === 'POP') {
      return;
    }

    // update activeTagName state from sanitized path
    const {pathname} = location;
    this.activeTagName = getTagNameFromPathname(pathname);
    this.activeSlug = getSlugFromPathname(pathname);
  }

  componentDidLoad() {
    // register the location listener
    this._unregisterLocationListener = this.history.listen((location, action) => this.onLocationChanged(location, action));

    // navigate initially
    const {pathname} = this.history.location;
    let activeTagName = getTagNameFromPathname(pathname);
    let activeSlug = getSlugFromPathname(pathname);
    if (!activeTagName && this.paths.size > 0) {
      activeTagName = this.paths.keys().next().value;
      if ('paths' in this.paths.get(activeTagName) && this.paths.get(activeTagName).paths.size > 0) {
        activeSlug = this.paths.get(activeTagName).paths.keys().next().value;
        // no path is given, so redirect to first component
        this.history.push(`/${activeTagName}/${activeSlug}`);
      }
    } else {
      // set the state from the initial path
      this.activeTagName = activeTagName;
      this.activeSlug = activeSlug;
    }
  }

  componentDidUnload() {
    this._unregisterLocationListener();
  }

  handlePropertyChange([property, value]: [string, PreviewOptionValue]) {
    this.metadata = {
      ...this.metadata,
      properties: {
        ...(this.metadata.properties && this.metadata.properties),
        [property]: {
          ...(this.metadata.properties && this.metadata.properties[property]),
          value,
        },
      },
    };
  }

  render() {
    return [
      <aside>
        <so-preview-navigation history={this.history}
                               paths={this.paths}
                               activeTagName={this.activeTagName}
                               activeSlug={this.activeSlug}
                               darkTheme={this.darkTheme}
                               gridVisible={this.gridVisible}
        />
        <so-preview-settings class="settings"
                             darkTheme={this.darkTheme}
                             gridVisible={this.gridVisible}
                             onThemeChanged={event => this.darkTheme = event.detail}
                             onGridVisibilityChanged={event => this.gridVisible = event.detail}
        />
      </aside>,

      <main>
        {this.hasActiveComponent && [
          <so-preview-renderer class="renderer"
                               activeTagName={this.activeTagName}
                               metadata={this.metadata}
                               darkTheme={this.darkTheme}
                               gridVisible={this.gridVisible}
          />,
          <so-preview-properties class="properties"
                                 activeTagName={this.activeTagName}
                                 metadata={this.metadata}
                                 darkTheme={this.darkTheme}
                                 gridVisible={this.gridVisible}
                                 onPropertyChange={event => this.handlePropertyChange(event.detail)}
          />,
          <so-preview-code class="code"
                           activeTagName={this.activeTagName}
                           metadata={this.metadata}
          />,
        ]}

        {!this.hasActiveComponent && (
          <span>No component found for <code>{this.activeTagName}</code> tag name.</span>
        )}
      </main>,
    ];
  }

}
