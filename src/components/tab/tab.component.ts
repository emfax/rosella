import RosellaElement from "../../element/rosella-element";
import { CSSResultGroup, html } from "lit";
import { property } from 'lit/decorators.js';
import { classMap } from "lit/directives/class-map.js";
// import { ifDefined } from 'lit/directives/if-defined.js';
// import { live } from 'lit/directives/live.js';
import styles from "./tab.styles";
// import { SlotOccupiedController } from "../../control/slot";

/**
 * @summary A tab component for use with `TabGroup` and `TabPanel`.
 * @documentation https://rosel.la/components/tab
 * @tag ui-tab
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class Tab extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  /** The name of the tab panel this tab is associated with. The panel must be located in the same tab group. */
  @property({ reflect: true }) panel = '';

  /** Draws the tab in an active state. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Disables the tab and prevents selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
    // this.id = this.id.length > 0 ? this.id : this.componentId;

    return html`
      <div
        part="base"
        class=${classMap({
      tab: true,
      'active': this.active,
      // 'tab--closable': this.closable,
      'disabled': this.disabled
    })}
      >
        <slot></slot>
      </div>
    `;
  }
}