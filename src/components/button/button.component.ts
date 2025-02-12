import RosellaElement, { RosellaFormControl } from "../../element/rosella-element";
import { CSSResultGroup, html } from "lit";
import { property, query, state } from 'lit/decorators.js';
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from 'lit/directives/if-defined.js';
// import { live } from 'lit/directives/live.js';
// import { SlotOccupiedController } from "../../control/slot";
import styles from "./button.styles";
import { FormControlController, validValidityState } from "../../element/form";
// import { literal } from "lit/static-html.js";

/**
 * @summary A button element.
 * @documentation https://rosel.la/components/button
 * @tag ui-button
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class Button extends RosellaElement implements RosellaFormControl {
  static styles: CSSResultGroup = [styles];

  static formAssociated = true;
  internals: ElementInternals;

  private readonly formControlController: FormControlController;

  @query('button') button?: HTMLButtonElement | HTMLLinkElement;

  // @state() private hasFocus = false;
  @state() invalid = false;

  /** The button's theme variant. */
  @property({ reflect: true }) variant: 'default' | 'primary' | 'secondary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text' =
    'default';

  /** The button's size. */
  @property({ reflect: true }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Draws the button in a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /**
   * The type of button. Note that the default value is `button` instead of `submit`, which is opposite of how native
   * `<button>` elements behave. When the type is `submit`, the button will submit the surrounding form.
   */
  @property({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * The name of the button, submitted as a name/value pair with form data, but only when this button is the submitter.
   * This attribute is ignored when `href` is present.
   */
  @property() name = '';

  /**
   * The value of the button, submitted as a pair with the button's name as part of the form data, but only when this
   * button is the submitter. This attribute is ignored when `href` is present.
   */
  @property() value = '';

  /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. */
  @property() href = '';

  // RosellaFormControl
  get form(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  constructor() {
    super();

    let internals = this.attachInternals();
    internals.role = 'button';

    this.internals = internals;

    this.formControlController = new FormControlController(this, internals);
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.type === 'submit') {
      this.formControlController.form?.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        console.log(e);
      });
    }
  }

  /** Gets the validity state object */
  get validity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).validity;
    }

    return validValidityState;
  }

  /** Gets the validation message */
  get validationMessage() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).validationMessage;
    }

    return '';
  }

  firstUpdated() {
    if (this.isButton()) {
      this.formControlController.updateValidity();
    }
  }

  private handleBlur() {
    // this.hasFocus = false;
    // this.emit('sl-blur');
  }

  private handleFocus() {
    // this.hasFocus = true;
    // this.emit('sl-focus');
  }

  private handleClick() {
    if (this.type === 'submit') {
      this.formControlController.submit(this);
    }

    if (this.type === 'reset') {
      this.formControlController.reset(this);
    }
  }

  private handleInvalid() {
    this.formControlController.setValidity(false);
    // this.formControlController.emitInvalidEvent(event);
  }

  private isButton() {
    return this.href ? false : true;
  }

  private isLink() {
    return this.href ? true : false;
  }

  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).checkValidity();
    }

    return true;
  }

  /** Gets the associated form, if one exists. */
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    if (this.isButton()) {
      return (this.button as HTMLButtonElement).reportValidity();
    }

    return true;
  }

  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message: string) {
    if (this.isButton()) {
      (this.button as HTMLButtonElement).setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }

  render() {
    const isLink = this.isLink();

    /* eslint-disable lit/no-invalid-html */
    /* eslint-disable lit/binding-positions */
    return html`
      <button
        part="base"
        class=${classMap({
      button: true,
      'default': this.variant === 'default',
      'primary': this.variant === 'primary',
      'secondary': this.variant === 'secondary',
      'success': this.variant === 'success',
      'neutral': this.variant === 'neutral',
      'warning': this.variant === 'warning',
      'danger': this.variant === 'danger',
      'text': this.variant === 'text',
      'xs': this.size === 'xs',
      'sm': this.size === 'sm',
      'md': this.size === 'md',
      'lg': this.size === 'lg',
      'xl': this.size === 'xl',
      // 'button--caret': this.caret,
      // 'button--circle': this.circle,
      // 'button--disabled': this.disabled,
      // 'button--focused': this.hasFocus,
      // 'button--loading': this.loading,
      // 'button--standard': !this.outline,
      // 'button--outline': this.outline,
      // 'button--pill': this.pill,
      // 'button--rtl': this.localize.dir() === 'rtl',
      // 'button--has-label': this.hasSlotController.test('[default]'),
      // 'button--has-prefix': this.hasSlotController.test('prefix'),
      // 'button--has-suffix': this.hasSlotController.test('suffix')
    })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${ifDefined(isLink ? undefined : this.type)}
        title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
        name=${ifDefined(isLink ? undefined : this.name)}
        value=${ifDefined(isLink ? undefined : this.value)}
        href=${ifDefined(isLink && !this.disabled ? this.href : undefined)}
        role=${ifDefined(isLink ? undefined : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.loading ? html`<sl-spinner part="spinner"></sl-spinner>` : ''}
      </button>
    `;
    /* eslint-enable lit/no-invalid-html */
    /* eslint-enable lit/binding-positions */
  }
}