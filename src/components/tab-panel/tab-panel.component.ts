import RosellaElement from "../../element/rosella-element";
import { CSSResultGroup, html } from "lit";
import { property } from 'lit/decorators.js';
// import { classMap } from "lit/directives/class-map.js";
// import { ifDefined } from 'lit/directives/if-defined.js';
// import { live } from 'lit/directives/live.js';
import styles from "./tab-panel.styles";
// import { SlotOccupiedController } from "../../control/slot";
// import type Tab from '../tab';

/**
 * @summary A component for building a tab panel. Use inside `TabGroup`.
 * @documentation https://rosel.la/components/input
 * @tag ui-tab-panel
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class TabPanel extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  /** The tab panel's name. */
  @property({ reflect: true }) name = '';

  /** When true, the tab panel will be shown. */
  @property({ type: Boolean, reflect: true }) active = false;

  render() {
    return html`
      <slot></slot>
    `;
  }
}