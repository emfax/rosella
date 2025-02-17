// import { classMap } from 'lit/directives/class-map.js';
import { getTextContent } from '../../internal/slot';
// import { html } from 'lit';
// import { LocalizeController } from '../../utilities/localize.js';
// import { property, query } from 'lit/decorators.js';
// import { SubmenuController } from './submenu-controller.js';
// import { watch } from '../../internal/watch.js';
// import componentStyles from '../../styles/component.styles.js';
// import ShoelaceElement from '../../internal/shoelace-element.js';
// import SlIcon from '../icon/icon.component.js';
// import SlPopup from '../popup/popup.component.js';
// import SlSpinner from '../spinner/spinner.component.js';
// import styles from './menu-item.styles.js';
// import type { CSSResultGroup } from 'lit';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import RosellaElement from '../../element/rosella-element.js';
import styles from './menu-item.styles';
import type { CSSResultGroup, PropertyValues } from 'lit';
import { SlotOccupiedController } from '../../control/slot.js';
import { SubmenuController } from './submenu-controller.js';
import { classMap } from 'lit/directives/class-map.js';
import { HighlightController } from '../../internal/highlight.js';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';

/**
 * @summary Menu items provide options for the user to pick from in a menu.
 * @documentation https://shoelace.style/components/menu-item
 * @tag ui-menu-item
 *
 * @dependency sl-icon
 * @dependency sl-popup
 * @dependency sl-spinner
 *
 * @slot - The menu item's label.
 * @slot prefix - Used to prepend an icon or similar element to the menu item.
 * @slot suffix - Used to append an icon or similar element to the menu item.
 * @slot submenu - Used to denote a nested menu.
 *
 * @csspart base - The component's base wrapper.
 * @csspart checked-icon - The checked icon, which is only visible when the menu item is checked.
 * @csspart prefix - The prefix container.
 * @csspart label - The menu item label.
 * @csspart suffix - The suffix container.
 * @csspart spinner - The spinner that shows when the menu item is in the loading state.
 * @csspart spinner__base - The spinner's base part.
 * @csspart submenu-icon - The submenu icon, visible only when the menu item has a submenu (not yet implemented).
 *
 * @cssproperty [--submenu-offset=-2px] - The distance submenus shift to overlap the parent menu.
 */
export default class MenuItem extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  static listBoxAssociated = true;

  private cachedTextLabel!: string;
  // private readonly localize = new LocalizeController(this);

  private internals = this.attachInternals();

  @query('slot:not([name])') defaultSlot!: HTMLSlotElement;
  @query('.menu-item') menuItem?: HTMLElement;
  @query('.sub-menu') subMenu!: HTMLElement;
  @query('.label-container') labelContainer!: HTMLElement;

  @property() currentFocused?: HTMLElement

  /** The type of menu item to render. To use `checked`, this value must be set to `checkbox`. */
  @property() type: 'normal' | 'checkbox' = 'normal';

  /** Draws the item in a checked state. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** A unique value to store in the menu item. This can be used as a way to identify menu items when selected. */
  @property({ reflect: true }) label = '';

  /** A unique value to store in the menu item. This can be used as a way to identify menu items when selected. */
  @property() value = '';

  /** Draws the menu item in a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Draws the menu item in a disabled state, preventing selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private readonly hasSlotController = new SlotOccupiedController(this, 'submenu');
  private submenuController: SubmenuController = new SubmenuController(this, this.hasSlotController);

  constructor() {
    super();

    this.addEventListener('mouseleave', () => {
      this.internals.states.delete('--highlight');
      this.currentFocused = undefined;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleHostClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // TODO - Do these actually need to be removed?
    // this.removeEventListener('click', this.handleHostClick);
    // this.removeEventListener('mouseenter', this.handleMouseEnter);
    // this.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('disabled')) {
      this.handleDisabledChange();
    }

    if (changedProperties.has('type')) {
      this.handleTypeChange();
    }

    if (changedProperties.has('checked')) {
      this.handleCheckedChange();
    }

    if (changedProperties.has('currentFocused')) {
      if (this.currentFocused === this) {
        this.internals.states.add('--highlight');

        if (this.hasSlotController.test('submenu')) {
          computePosition(this, this.subMenu, {
            placement: 'right-start',
            middleware: [offset(), flip(), shift({ padding: 6 })],
          }).then(({ x, y }) => {
            Object.assign(this.subMenu.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });

          this.subMenu!.showPopover();
        }
      } else {
        this.internals.states.delete('--highlight');

        if (this.hasSlotController.test('submenu')) {
          this.subMenu!.hidePopover();
        }
      }
    }
  }

  private handleDefaultSlotChange() {
    const textLabel = this.getTextLabel();

    // Ignore the first time the label is set
    if (typeof this.cachedTextLabel === 'undefined') {
      this.cachedTextLabel = textLabel;
      return;
    }

    // When the label changes, emit a slotchange event so parent controls see it
    if (textLabel !== this.cachedTextLabel) {
      this.cachedTextLabel = textLabel;
      this.emit('slotchange', { bubbles: true, composed: false, cancelable: false });
    }
  }

  private handleHostClick = (event: MouseEvent) => {
    // Prevent the click event from being emitted when the button is disabled or loading
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  private handleMouseOver = (event: MouseEvent) => {
    this.focus();
    event.stopPropagation();
  }

  handleCheckedChange() {
    // For proper accessibility, users have to use type="checkbox" to use the checked attribute
    if (this.checked && this.type !== 'checkbox') {
      this.checked = false;
      console.error('The checked attribute can only be used on menu items with type="checkbox"', this);
      return;
    }

    // Only checkbox types can receive the aria-checked attribute
    if (this.type === 'checkbox') {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    } else {
      this.removeAttribute('aria-checked');
    }
  }

  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  handleTypeChange() {
    if (this.type === 'checkbox') {
      this.setAttribute('role', 'menuitemcheckbox');
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    } else {
      this.setAttribute('role', 'menuitem');
      this.removeAttribute('aria-checked');
    }
  }

  /** Returns a text label based on the contents of the menu item's default slot. */
  getTextLabel() {
    return getTextContent(this.defaultSlot);
  }

  isSubmenu() {
    return this.hasSlotController.test('submenu');
  }

  render() {
    const isRtl = false; // this.localize.dir() === 'rtl';
    const isSubmenuExpanded = this.submenuController.isExpanded();


    return html`
      <div class="menu-item">
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <div class="label-container">
          <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}>${this.label}</slot>
        </div>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        ${this.isSubmenu() ? html`<ui-icon name=${isRtl ? 'chevron-left' : 'chevron-right'} aria-hidden="true"></ui-icon>` : ''}
      </div>

      <div class="sub-menu" popover="manual">
        <slot name="submenu"></slot>
      </div>
    `;
  }
}