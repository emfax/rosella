import { CSSResultGroup, html, PropertyValues } from "lit";
import RosellaElement from "../../element/rosella-element";
import { property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./popover.styles";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";


/**
 * @summary A popover thing.
 * @documentation https://rosel.la/components/input
 * @tag ui-popover
 * 
 * @slot anchor - Anchoring element for the popover
 */
export default class Popover extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  @query('slot[name="anchor"]') private anchor!: HTMLSlotElement;
  @query('.popover') private popoverPanel!: HTMLDivElement;

  /**
   * Activates the positioning logic and shows the popup. When this attribute is removed, the positioning logic is torn
   * down and the popup will be hidden.
   */
  @property({ type: Boolean, reflect: true }) active = false;

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('active')) {
      if (this.active) {
        this.showPopover();
      } else {
        this.popoverPanel.hidePopover();
      }
    }
  }


  showPopover() {
    if (!this.anchor.assignedElements().length) {
      return;
    }
    let anchor = this.anchor.assignedElements()[0] as HTMLElement;

    computePosition(anchor, this.popoverPanel, {
      placement: 'bottom-start',
      middleware: [offset(6), flip(), shift({ padding: 6 })],
    }).then(({ x, y }) => {
      Object.assign(this.popoverPanel.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });

    this.popoverPanel.togglePopover();

    this.popoverPanel.focus({ preventScroll: true });
  }

  render() {
    return html`
      <slot name="anchor"></slot>
      <div class="${classMap({
      'popover': true,
      'active': this.active,
    })}" popover>
        <slot></slot>
      </div>
    `;
  }
}