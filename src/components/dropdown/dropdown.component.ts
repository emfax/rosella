import { CSSResultGroup, html } from "lit";
import RosellaElement from "../../element/rosella-element";
import styles from "./dropdown.styles";
import { query } from "lit/decorators.js";
import Popover from "../popover";

export default class Dropdown extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  // @ts-ignore - TS doesn't know about the query decorator
  @query('ui-popover') private popover!: Popover;

  private handleTriggerClick() {
    this.popover.active = !this.popover.active;
  }

  render() {
    return html`
      <ui-popover>
        <slot
          name="trigger"
          slot="anchor"
          @click=${this.handleTriggerClick}
        ></slot>
        <slot></slot>
      </ui-popover>
    `;
  }
}