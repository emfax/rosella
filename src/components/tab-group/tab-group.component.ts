import RosellaElement from "../../element/rosella-element";
import { CSSResultGroup, html } from "lit";
import { queryAssignedElements } from 'lit/decorators.js';
import { classMap } from "lit/directives/class-map.js";
// import { ifDefined } from 'lit/directives/if-defined.js';
// import { live } from 'lit/directives/live.js';
// import { SlotOccupiedController } from "../../control/slot";
import styles from "./tab-group.styles";
import type Tab from '../tab';
import type TabPanel from '../tab-panel';

/**
 * @summary A container for building tabs.
 * @documentation https://rosel.la/components/tab-group
 * @tag ui-tab-group
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class TabGroup extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  private activeTab?: Tab;
  private tabs: Tab[] = [];
  private panels: TabPanel[] = [];

  @queryAssignedElements() body!: HTMLElement[];

  private getAllTabs() {
    const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="tabs"]')!;

    return slot.assignedElements() as Tab[];
  }

  private getAllPanels() {
    return [...this.body].filter(el => el.tagName.toLowerCase() === 'ui-tab-panel') as TabPanel[];
  }

  private syncTabsAndPanels() {
    this.tabs = this.getAllTabs();
    // this.focusableTabs = this.tabs.filter(el => !el.disabled);

    this.panels = this.getAllPanels();
    // this.syncIndicator();

    // After updating, show or hide scroll controls as needed
    // this.updateComplete.then(() => this.updateScrollControls());
  }

  private setActiveTab(tab: Tab, options?: { emitEvents?: boolean; scrollBehavior?: 'auto' | 'smooth' }) {
    options = {
      emitEvents: true,
      scrollBehavior: 'auto',
      ...options
    };

    if (tab !== this.activeTab && !tab.disabled) {
      // const previousTab = this.activeTab;
      this.activeTab = tab;

      // Sync active tab and panel
      this.tabs.forEach(el => {
        el.active = el === this.activeTab;
        el.tabIndex = el === this.activeTab ? 0 : -1;
      });
      this.panels.forEach(el => (el.active = el.name === this.activeTab?.panel));

      // this.syncIndicator();

      // if (['top', 'bottom'].includes(this.placement)) {
      //   scrollIntoView(this.activeTab, this.nav, 'horizontal', options.scrollBehavior);
      // }

      // Emit events
      // if (options.emitEvents) {
      //   if (previousTab) {
      //     this.emit('sl-tab-hide', { detail: { name: previousTab.panel } });
      //   }

      //   this.emit('sl-tab-show', { detail: { name: this.activeTab.panel } });
      // }
    }
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const tab = target.closest('ui-tab') as Tab;
    const tabGroup = tab?.closest('ui-tab-group');

    // Ensure the target tab is in this tab group
    if (tabGroup !== this) {
      return;
    }

    if (tab !== null) {
      this.setActiveTab(tab, { scrollBehavior: 'smooth' });
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateComplete.then(() => {
      this.syncTabsAndPanels();
    });
  }

  render() {
    return html`
      <div
        class="${classMap({
      'tab-group': true,
    })}"
    @click=${this.handleClick}
      >
        <div class="tabs">
          <slot name="tabs"></slot>
        </div>
        <div class="panel">
          <slot></slot>
        </div>
      </div>
    `;
  }
}