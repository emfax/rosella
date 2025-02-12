import { CSSResultGroup, html } from "lit";
import RosellaElement from "../../element/rosella-element";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./popover.styles";

/**
 * @summary Collect textual data from the user.
 * @documentation https://rosel.la/components/input
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class Popover extends RosellaElement {
  static styles: CSSResultGroup = [styles];
  /**
   * Activates the positioning logic and shows the popup. When this attribute is removed, the positioning logic is torn
   * down and the popup will be hidden.
   */
  @property({ type: Boolean, reflect: true }) active = false;

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