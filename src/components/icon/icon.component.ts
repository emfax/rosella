
import { property, state } from 'lit/decorators.js';
import styles from './icon.styles';
import type { CSSResultGroup, HTMLTemplateResult, PropertyValues } from 'lit';
import RosellaElement from '../../element/rosella-element.js';
import icons from "./library";
import { resolveIcon } from './store';

const CACHEABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
type SVGResult = HTMLTemplateResult | SVGElement | typeof RETRYABLE_ERROR | typeof CACHEABLE_ERROR;

// let parser: DOMParser;
const iconCache = new Map<string, Promise<SVGResult>>();

// interface IconSource {
//   url?: string;
//   fromLibrary: boolean;
// }

/**
 * @summary Icons are symbols that can be used to represent various options within an application.
 * @documentation https://shoelace.style/components/icon
 * @tag ui-icon
 *
 * @event ui-load - Emitted when the icon has loaded. When using `spriteSheet: true` this will not emit.
 * @event ui-error - Emitted when the icon fails to load due to an error. When using `spriteSheet: true` this will not emit.
 *
 * @csspart svg - The internal SVG element.
 * @csspart use - The <use> element generated when using `spriteSheet: true`
 */
export default class Icon extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  @state() private svg: SVGElement | null = null;

  /** The name of the icon to draw. Available names depend on the icon library being used. */
  @property({ reflect: true }) name?: string;

  /**
   * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
   * can result in XSS attacks.
   */
  @property({ reflect: true }) src?: string;

  /** The icon's size. */
  @property({ reflect: true }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.setIcon();
  }

  private async resolveIcon(): Promise<SVGElement> {
    if (this.src !== undefined) {
      console.log(this.src);

      return resolveIcon(this.src);
    }

    let source: string = icons[this.name as keyof typeof icons];

    const parser = new DOMParser();

    const doc = parser.parseFromString(source, "image/svg+xml");

    const svg = doc.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg").item(0);

    if (svg !== null) {
      iconCache.set(this.name as string, Promise.resolve(svg.cloneNode(true) as SVGElement));
    }

    return svg as SVGElement;
  }

  async setIcon() {
    this.svg = await this.resolveIcon();
    console.log(this.svg);
  }

  render() {
    if (this.svg !== null) {
      this.svg.classList.add(this.size);
    }

    return this.svg;
  }
}