import RosellaElement, { RosellaFormControl } from "../../element/rosella-element";
import { CSSResultGroup, html } from "lit";
import { property, query } from 'lit/decorators.js';
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { SlotOccupiedController } from "../../control/slot";
import styles from "./input.styles";
import formControlStyles from "../../styles/form-control";
import { FormControlController } from "../../element/form";

let inputId = 0;

/**
 * @tag ui-input
 * @summary Collect textual data from the user.
 * @documentation https://rosel.la/components/input
 * 
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 */
export default class Input extends RosellaElement implements RosellaFormControl {
  static styles: CSSResultGroup = [styles, formControlStyles];

  static formAssociated = true;

  readonly form: HTMLFormElement | null = null;

  private readonly formControlController: FormControlController;

  private readonly slotOccupiedController = new SlotOccupiedController(this, 'help-text', 'label');

  readonly inputId = `input-${inputId++}`;

  @query('input') input?: HTMLInputElement;

  // @state() private hasFocus = false;

  /**
   * The type of input. Works the same as a native `<input>` element, but only a subset of types are supported. Defaults
   * to `text`.
   */
  @property({ reflect: true }) type:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url' = 'text';

  /** The name of the input, submitted as a name/value pair with form data. */
  @property({ reflect: true }) name?: string;

  /** The current value of the input, submitted as a name/value pair with form data. */
  value = '';

  /** The input's size. */
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's label. If you need to display HTML, use the `label` slot instead. */
  @property() label = '';

  /** The input's help text. If you need to display HTML, use the `help-text` slot instead. */
  @property({ attribute: 'help' }) helpText = '';

  /** Adds a clear button when the input is not empty. */
  @property({ type: Boolean }) clearable = false;

  /** Disables the input. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Placeholder text to show as a hint when the input is empty. */
  @property() placeholder = '';

  /** Makes the input readonly. */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /** Determines whether or not the password is currently visible. Only applies to password input types. */
  @property({ attribute: 'password-visible', type: Boolean }) passwordVisible = false;

  /**
   * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
   * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
   * the same document or shadow root for this to work.
   */
  @property({ attribute: 'form' }) associatedForm?: string;

  /** Makes the input a required field. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** A regular expression pattern to validate input against. */
  @property() pattern?: string;

  /** The minimum length of input that will be considered valid. */
  @property({ type: Number }) minlength?: number;

  /** The maximum length of input that will be considered valid. */
  @property({ type: Number }) maxlength?: number;

  /** The input's minimum value. Only applies to date and number input types. */
  @property() min?: number | string;

  /** The input's maximum value. Only applies to date and number input types. */
  @property() max?: number | string;

  /**
   * Specifies the granularity that the value must adhere to, or the special value `any` which means no stepping is
   * implied, allowing any numeric value. Only applies to date and number input types.
   */
  @property() step?: number | 'any';

  /** Indicates whether the browser's autocorrect feature is on or off. */
  @property() autocorrect?: 'off' | 'on';

  /**
   * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
   * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
   */
  @property() autocomplete?: string;

  /** Used to customize the label or icon of the Enter key on virtual keyboards. */
  @property() enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /**
   * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
   * keyboard on supportive devices.
   */
  @property() inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

  constructor() {
    super();

    let internals = this.attachInternals();
    internals.role = 'input';

    // this.internals = internals;

    this.formControlController = new FormControlController(this, internals);
  }

  protected firstUpdated(): void {
    this.formControlController.updateValidity();
  }

  /** Gets the validity state object */
  get validity() {
    return this.input!.validity;
  }

  /** Gets the validation message */
  get validationMessage() {
    return this.input!.validationMessage;
  }

  private handleInput() {
    this.value = this.input!.value;
    this.formControlController.updateValidity();
    this.formControlController.setFormValue(this.value);
    this.emit('ui-input');
  }

  private handleInvalid(event: Event) {
    console.log('input invalid', event)
    // this.formControlController.setValidity(false);
    // this.formControlController.emitInvalidEvent(event);
  }

  /** Sets focus on the input. */
  focus(options?: FocusOptions) {
    console.log('focus me input');

    this.input!.focus(options);
  }

  /** Removes focus from the input. */
  blur() {
    this.input!.blur();
  }

  /** Selects all the text in the input. */
  select() {
    this.input!.select();
  }

  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    console.log('check me input');

    return this.formControlController.internals.checkValidity();
  }

  /** Gets the associated form, if one exists. */
  getForm(): HTMLFormElement | null {
    return this.formControlController.getForm();
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    return this.input!.reportValidity();
  }

  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message: string) {
    this.input!.setCustomValidity(message);
    this.formControlController.updateValidity();
  }

  protected render(): unknown {
    const hasHelpTextSlot = this.slotOccupiedController.test('help-text');
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;

    return html`
      <div>
        <label class="${classMap({ 'required': this.required })}" for="input">
          <slot name="label">${this.label}</slot>
        </label>
        <div class="${classMap({
      'input': true,
      'small': this.size === 'small',
      'medium': this.size === 'medium',
      'large': this.size === 'large',
    })}">
            <span part="prefix" class="prefix">
              <slot name="prefix"></slot>
            </span>
            <input
              part="input"
              id="input"
              class="input-element"
              type=${this.type === 'password' && this.passwordVisible ? 'text' : this.type}
              title=${this.title /* An empty title prevents browser validation tooltips from appearing on hover */}
              name=${ifDefined(this.name)}
              ?form=${this.form}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${ifDefined(this.placeholder)}
              minlength=${ifDefined(this.minlength)}
              maxlength=${ifDefined(this.maxlength)}
              min=${ifDefined(this.min)}
              max=${ifDefined(this.max)}
              step=${ifDefined(this.step as number)}
              .value=${live(this.value)}
              autocapitalize=${ifDefined(this.autocapitalize)}
              autocomplete=${ifDefined(this.autocomplete)}
              autocorrect=${ifDefined(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${ifDefined(this.pattern)}
              enterkeyhint=${ifDefined(this.enterkeyhint)}
              inputmode=${ifDefined(this.inputmode)}
              aria-describedby="help-text"
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
            />
            <span part="suffix" class="suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        <div
          part="help-text"
          class="help-text"
          aria-hidden=${hasHelpText ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
}