import { CSSResultGroup, html } from "lit";
import RosellaElement from "../../element/rosella-element";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./option.styles";
import { HighlightController } from "../../internal/highlight";

/**
 * @summary Option element for use in listboxes or `Select`.
 * @documentation https://rosel.la/components/option
 * @tag ui-option
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class Option extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  private isInitialized = false;

  private highlightController: HighlightController;

  @state() current = false; // the user has keyed into the option, but hasn't selected it yet (shows a highlight)
  @state() hasHover = false; // we need this because Safari doesn't honor :hover styles while dragging

  /**
   * The option's value. When selected, the containing form control will receive this value. The value must be unique
   * from other options in the same group. Values may not contain spaces, as spaces are used as delimiters when listing
   * multiple values.
   */
  @property({ reflect: true }) value = '';

  /**
   * The option is selected and has aria-selected="true".
   */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Draws the option in a disabled state, preventing selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  constructor() {
    super();

    this.highlightController = new HighlightController(this, this.attachInternals());
  }

  connectedCallback() {
    super.connectedCallback();

    this.emit('ui-connect')
  }

  private handleDefaultSlotChange() {
    if (this.isInitialized) {
      // When the label changes, tell the controller to update
      customElements.whenDefined('ui-select').then(() => {
        const controller = this.closest('ui-select');

        if (controller) {
          controller.handleDefaultSlotChange();
        }
      });
    } else {
      this.isInitialized = true;
    }
  }

  /** Returns a plain text label based on the option's content. */
  getTextLabel() {
    const nodes = this.childNodes;
    let label = '';

    [...nodes].forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!(node as HTMLElement).hasAttribute('slot')) {
          label += (node as HTMLElement).textContent;
        }
      }

      if (node.nodeType === Node.TEXT_NODE) {
        label += node.textContent;
      }
    });

    return label.trim();
  }

  render() {
    return html`
      <sl-icon part="checked-icon" class="option__check" name="check" library="system" aria-hidden="true"></sl-icon>
      <slot part="prefix" name="prefix" class="option__prefix"></slot>
      <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
      <slot part="suffix" name="suffix" class="option__suffix"></slot>
    `;
  }
}