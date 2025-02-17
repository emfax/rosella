import { html } from 'lit';
import { query } from 'lit/decorators.js';
import RosellaElement from '../../element/rosella-element.js';
import styles from './menu.styles';
import type { CSSResultGroup } from 'lit';
import MenuItem from '../menu-item';

export interface MenuSelectEventDetail {
  item: MenuItem;
}

/**
 * @summary Menus provide a list of options for the user to choose from.
 * @documentation https://shoelace.style/components/menu
 * @tag ui-menu
 *
 * @slot - The menu's content, including menu items, menu labels, and dividers.
 *
 * @event {{ item: SlMenuItem }} sl-select - Emitted when a menu item is selected.
 */
export default class Menu extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  @query('slot') defaultSlot!: HTMLSlotElement;

  private items: MenuItem[] = [];

  constructor() {
    super();

    this.addEventListener('mousemove', this.handleMousemove);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'menu');
  }

  private handleMousemove = (e: Event) => {
    if (e.target === this) return;

    if (this.items.includes(e.target as MenuItem)) {
      this.items.forEach(i => i.currentFocused = e.target as MenuItem)
    }
  }

  private handleClick(event: MouseEvent) {
    const menuItemTypes = ['menuitem', 'menuitemcheckbox'];

    const composedPath = event.composedPath();
    const target = composedPath.find((el: EventTarget) => menuItemTypes.includes((el as Element)?.getAttribute?.('role') || ''));

    if (!target) return;

    const closestMenu = composedPath.find((el: EventTarget) => (el as Element)?.getAttribute?.('role') === 'menu');
    const clickHasSubmenu = closestMenu !== this;

    // Make sure we're the menu thats supposed to be handling the click event.
    if (clickHasSubmenu) return;

    // This isn't true. But we use it for TypeScript checks below.
    const item = target as MenuItem;

    if (item.type === 'checkbox') {
      item.checked = !item.checked;
    }

    this.emit('ui-select', { detail: { item } });
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Make a selection when pressing enter or space
    if (event.key === 'Enter' || event.key === ' ') {
      const item = this.getCurrentItem();
      event.preventDefault();
      event.stopPropagation();

      // Simulate a click to support @click handlers on menu items that also work with the keyboard
      item?.click();
    }

    // Move the selection when pressing down or up
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      const items = this.getAllItems();
      const activeItem = this.getCurrentItem();
      let index = activeItem ? items.indexOf(activeItem) : 0;

      if (items.length > 0) {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'ArrowDown') {
          index++;
        } else if (event.key === 'ArrowUp') {
          index--;
        } else if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = items.length - 1;
        }

        if (index < 0) {
          index = items.length - 1;
        }
        if (index > items.length - 1) {
          index = 0;
        }

        this.setCurrentItem(items[index]);
        items[index].focus();
      }
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isMenuItem(target)) {
      this.setCurrentItem(target as MenuItem);
    }
  }

  private handleSlotChange() {
    this.items = this.getAllItems();

    console.log('slotchange', this.items);
  }

  private isMenuItem(item: HTMLElement) {
    return (
      item.tagName.toLowerCase() === 'ui-menu-item' ||
      ['menuitem', 'menuitemcheckbox', 'menuitemradio'].includes(item.getAttribute('role') ?? '')
    );
  }

  /** @internal Gets all slotted menu items, ignoring dividers, headers, and other elements. */
  getAllItems(): MenuItem[] {
    const items: MenuItem[] = [];

    const elements = this.defaultSlot?.assignedElements({ flatten: true });

    if (elements.length === 0) {
      return items;
    }

    for (const el of elements) {
      // @ts-ignore - TypeScript doesn't know about possible static properties
      if (el.constructor.listBoxAssociated === true) {
        items.push(el as MenuItem);
      }
    }

    return items;
  }

  /**
   * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
   * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
   */
  getCurrentItem() {
    return this.getAllItems().find(i => i.getAttribute('tabindex') === '0');
  }

  /**
   * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
   * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
   */
  setCurrentItem(item: MenuItem) {
    const items = this.getAllItems();

    // Update tab indexes
    items.forEach(i => {
      i.setAttribute('tabindex', i === item ? '0' : '-1');
    });
  }

  render() {
    return html`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `;
  }
}