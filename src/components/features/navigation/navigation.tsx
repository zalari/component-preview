import {Component, Prop} from '@stencil/core';
import {History} from 'history';

import {ElementTagName} from '../../../classes/preview-store.class';
import {PreviewPaths} from '../../../types/preview-paths.type';

@Component({
  tag: 'preview-navigation',
  styleUrl: 'navigation.scss',
  shadow: true,
})
export class Navigation {

  @Prop({reflectToAttr: true})
  darkTheme!: boolean;

  @Prop({reflectToAttr: true})
  gridVisible!: boolean;

  @Prop()
  readonly history!: History;

  @Prop()
  paths!: PreviewPaths;

  @Prop()
  activeTagName?: ElementTagName;

  @Prop()
  activeSlug?: string;

  showComponent(path: string, slug: string) {
    this.history.push(`/${path}/${slug}`);
  }

  render() {
    return (
      <nav>
        {this.paths.size > 0 && Array.from(this.paths).map(([path, {label, paths}]) => (
          <div class="group"
               role="navigation"
          >
            <span class="label">{label}</span>
            {paths && paths.size > 0 && Array.from(paths).map(([slug, {label}]) => (
              <a onClick={() => this.showComponent(path, slug)}
                 class={`link ${this.activeTagName === path && this.activeSlug === slug ? 'active' : undefined}`}
              >
                {label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    );
  }

}
