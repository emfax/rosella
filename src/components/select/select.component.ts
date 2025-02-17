import RosellaElement, { RosellaFormControl } from "../../element/rosella-element";
import { CSSResultGroup, html } from "lit";
import { property, query, state } from 'lit/decorators.js';
import { classMap } from "lit/directives/class-map.js";
// import { ifDefined } from 'lit/directives/if-defined.js';
// import { live } from 'lit/directives/live.js';
// import { SlotOccupiedController } from "../../control/slot";
import styles from "./select.styles";
import formControlStyles from "../../styles/form-control";
import inputStyles from "../../styles/input";
import { FormControlController } from "../../element/form";
import Option from "../option";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";

/**
 * @tag ui-select
 * @summary Collect textual data from the user.
 * @documentation https://rosel.la/components/input
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class Select extends RosellaElement implements RosellaFormControl {
  static styles: CSSResultGroup = [styles, formControlStyles, inputStyles];

  static formAssociated = true;

  readonly form: HTMLFormElement | null = null;

  private readonly formControlController: FormControlController;

  @query('input[readonly]') displayInput!: HTMLInputElement;
  @query('#value-input') input!: HTMLInputElement;
  @query('div.input') private inputContainer!: HTMLDivElement;
  @query('#listbox') private listBox!: HTMLDivElement;

  // @state() private hasFocus = false;
  @state() displayLabel = '';
  // @state() currentOption: SlOption;
  @state() selectedOptions: Option[] = [];
  @state() private valueHasChanged: boolean = false;

  private _value: string | string[] = '';

  /**
   * The current value of the select, submitted as a name/value pair with form data. When `multiple` is enabled, the
   * value attribute will be a space-delimited list of values based on the options selected, and the value property will
   * be an array. **For this reason, values must not contain spaces.**
   */
  @state()
  set value(val: string | string[]) {
    if (this.multiple) {
      val = Array.isArray(val) ? val : val.split(' ');
    } else {
      val = Array.isArray(val) ? val.join(' ') : val;
    }

    if (this._value === val) {
      return;
    }

    this.valueHasChanged = true;
    this._value = val;
    this.input.value = val as string;
  }

  get value() {
    return this._value;
  }
  /** The name of the input, submitted as a name/value pair with form data. */
  @property({ reflect: true }) name?: string;

  @property({ attribute: 'form' }) associatedForm?: string;

  /** Disables the input. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Placeholder text to show as a hint when the input is empty. */
  @property() placeholder = '';

  /** Allows more than one option to be selected. */
  @property({ type: Boolean, reflect: true }) multiple = false;

  /** The input's label. If you need to display HTML, use the `label` slot instead. */
  @property() label?: string;

  /**
   * The preferred placement of the select's menu. Note that the actual placement may vary as needed to keep the listbox
   * inside of the viewport.
   */
  @property({ reflect: true }) placement: 'top' | 'bottom' = 'bottom';

  /** The default value of the form control. Primarily used for resetting the form control. */
  @property({ attribute: 'value' }) defaultValue: string | string[] = '';

  /** The button's size. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Indicates whether or not the select is open. You can toggle this attribute to show and hide the menu, or you can
   * use the `show()` and `hide()` methods and this attribute will reflect the select's open state.
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /** The select's required attribute. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** The input's help text. If you need to display HTML, use the `help-text` slot instead. */
  @property({ attribute: 'help-text' }) helpText = '';

  constructor() {
    super();

    this.formControlController = new FormControlController(this, this.attachInternals(), {
      updateValidityOn: ['ui-select'],
    });
  }

  firstUpdated() {
    this.formControlController.updateValidity();

    this.input.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();

          this.showListBox();

          let idx = e.key === 'ArrowDown' ? 0 : -1;

          // this.getAllOptions().at(idx)?.highlight();
          break;

        case 'Enter':
          e.preventDefault();
          break;

        default:
          break;
      }
    });

    this.listBox.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();

          // navigate options up and down

          break;

        case 'Enter':
          e.preventDefault();

          // select the current option

          break;

        default:
          break;
      }
    });
  }

  get validity() {
    return this.input.validity;
  }

  checkValidity() {
    return this.input.checkValidity();
  }

  reportValidity() {
    return this.formControlController.reportValidity();
  }

  setCustomValidity() { };

  private showListBox() {
    computePosition(this.inputContainer, this.listBox, {
      placement: 'bottom-start',
      middleware: [offset(6), flip(), shift({ padding: 6 })],
    }).then(({ x, y }) => {
      Object.assign(this.listBox.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });

    this.listBox.togglePopover();

    this.listBox.focus({ preventScroll: true });
  }

  // Handlers

  private handleBlur() {
    // this.hasFocus = false;
  }

  private handleFocus() {
    // this.hasFocus = true;
  }

  private handleClick(_: Event) {
    this.showListBox();
  }

  private handleKeyDown(_: KeyboardEvent) { }

  private handleMouseDown(_: MouseEvent) { }

  private handleOptionClick(event: MouseEvent) {
    if (event.target instanceof Option) {
      let option = event.target as Option;

      this.displayInput.value = option.getTextLabel?.() ?? '';

      this.value = option.value;

      this.emit('ui-select');
    }

    this.listBox.hidePopover();
  }

  // Gets an array of all <sl-option> elements
  private getAllOptions() {
    return [...this.querySelectorAll<Option>('ui-option')];
  }

  /* @internal - used by options to update labels */
  public handleDefaultSlotChange() {
    if (!customElements.get('ui-option')) {
      customElements.whenDefined('ui-option').then(() => this.handleDefaultSlotChange());
    }

    const allOptions = this.getAllOptions();
    const val = this.valueHasChanged ? this.value : this.defaultValue;
    const value = Array.isArray(val) ? val : [val];
    const values: string[] = [];

    // Check for duplicate values in menu items
    allOptions.forEach(option => values.push(option.value));

    // Select only the options that match the new value
    this.setSelectedOptions(allOptions.filter(el => value.includes(el.value)));
  }

  // This method must be called whenever the selection changes. It will update the selected options cache, the current
  // value, and the display value
  private selectionChanged() {
    const options = this.getAllOptions();
    // Update selected options cache
    this.selectedOptions = options.filter(el => el.selected);

    // Keep a reference to the previous `valueHasChanged`. Changes made here don't count has changing the value.
    const cachedValueHasChanged = this.valueHasChanged;

    // Update the value and display label
    if (this.multiple) {
      this.value = this.selectedOptions.map(el => el.value);

      if (this.placeholder && this.value.length === 0) {
        // When no items are selected, keep the value empty so the placeholder shows
        this.displayLabel = '';
      } else {
        // this.displayLabel = this.localize.term('numOptionsSelected', this.selectedOptions.length);
      }
    } else {
      const selectedOption = this.selectedOptions[0];
      this.value = selectedOption?.value ?? '';
      this.displayLabel = selectedOption?.getTextLabel?.() ?? '';
    }
    this.valueHasChanged = cachedValueHasChanged;

    // Update validity
    this.updateComplete.then(() => {
      this.formControlController.updateValidity();
    });
  }

  // Sets the selected option(s)
  private setSelectedOptions(option: Option | Option[]) {
    const allOptions = this.getAllOptions();
    const newSelectedOptions = Array.isArray(option) ? option : [option];

    // Clear existing selection
    allOptions.forEach(el => (el.selected = false));

    // Set the new selection
    if (newSelectedOptions.length) {
      newSelectedOptions.forEach(el => (el.selected = true));
    }

    // Update selection, value, and display label
    this.selectionChanged();
  }

  render() {
    const hasLabel = this.label !== undefined && this.label.length > 0;
    const hasHelpText = this.helpText;

    return html`
      <div
        part="form-control"
      >
        <label
          id="label"
          part="label"
          aria-hidden=${hasLabel ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div><div
              part="input" class="${classMap({
      'input': true,
      'sm': this.size === 'sm',
      'md': this.size === 'md',
      'lg': this.size === 'lg',
    })}"
              slot="anchor"
              @click=${this.handleClick}
              @keydown=${this.handleKeyDown}
              @mousedown=${this.handleMouseDown}
            >
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <input
                part="display-input"
                type="text"
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .value=${this.displayLabel}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-controls="listbox"
                aria-expanded=${this.open ? 'true' : 'false'}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled ? 'true' : 'false'}
                aria-describedby="help-text"
                role="combobox"
                tabindex="0"
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
              />

              <input
                id="value-input"
                type="text"
                ?required=${this.required}
                tabindex="-1"
                aria-hidden="true"
                @focus=${() => this.focus()}
              />

              <slot name="suffix" part="suffix" class="select__suffix"></slot>

              <slot class="expand-icon" name="expand-icon" part="expand-icon">
                <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m19.5 8.25-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </slot>
            </div>
            <div
              id="listbox"
              class="listbox"
              role="listbox"
              aria-expanded=${this.open ? 'true' : 'false'}
              aria-labelledby="label"
              part="listbox"
              class="select__listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
              popover
            >
              <slot></slot>
            </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
}