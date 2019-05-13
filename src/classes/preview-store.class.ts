import {ElementMetaData} from '../interfaces/element-metadata.interface';
import {PreviewOptions} from '../interfaces/preview-options.interface';

export type ElementTagName = string;

export type ElementSlug = string;

export type ElementStore = Map<ElementTagName, Map<ElementSlug, ElementMetaData<Partial<PreviewOptions>>>>;

export type ElementsListener = (elements: ElementStore) => void;

export class PreviewStore {

  private static readonly _listeners: Set<ElementsListener> = new Set();

  private static readonly _elements: ElementStore = new Map();

  static addElement(tagName: ElementTagName, metaData: ElementMetaData<Partial<PreviewOptions>>) {
    // create a set if the tag name is unknown
    if (!this._elements.has(tagName)) {
      this._elements.set(tagName, new Map());
    }

    // add the element and notify listeners
    this._elements.get(tagName).set(metaData.slug, metaData);
    this._listeners.forEach(listener => listener(this._elements));
  }

  static addListener(listener: ElementsListener): boolean {
    // it is already registered
    if (this._listeners.has(listener)) {
      return false;
    }

    // add the listener
    this._listeners.add(listener);
    const success = this._listeners.has(listener);

    // send stored elements initially
    if (success) {
      listener(this._elements);
    }

    // and return if successful
    return success;
  }

}