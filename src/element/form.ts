import { ReactiveController } from "lit";
import { RosellaFormControl } from "./rosella-element";
import Button from "../components/button/button.component";

export const formCollections: WeakMap<HTMLFormElement, Set<RosellaFormControl>> = new WeakMap();

const userInteractedControls: WeakSet<RosellaFormControl> = new WeakSet();

const interactions = new WeakMap<RosellaFormControl, string[]>();

export interface FormControlControllerOptions {
  /** A function that returns the form containing the form control. */
  form: (input: RosellaFormControl) => HTMLFormElement | null;
  /** A function that returns the form control's name, which will be submitted with the form data. */
  name: (input: RosellaFormControl) => string | undefined;
  /** A function that returns the form control's current value. */
  value: (input: RosellaFormControl) => unknown | unknown[];
  /** A function that returns the form control's default value. */
  defaultValue: (input: RosellaFormControl) => unknown | unknown[];
  /** A function that returns the form control's current disabled state. If disabled, the value won't be submitted. */
  disabled: (input: RosellaFormControl) => boolean;
  /**
   * A function that maps to the form control's reportValidity() function. When the control is invalid, this will
   * prevent submission and trigger the browser's constraint violation warning.
   */
  reportValidity: (input: RosellaFormControl) => boolean;

  /**
   * A function that maps to the form control's `checkValidity()` function. When the control is invalid, this will return false.
   *   this is helpful is you want to check validation without triggering the native browser constraint violation warning.
   */
  checkValidity: (input: RosellaFormControl) => boolean;
  /** A function that sets the form control's value */
  setValue: (input: RosellaFormControl, value: unknown) => void;
  /**
   * An array of event names to listen to. When all events in the list are emitted, the control will receive validity
   * states such as user-valid and user-invalid.user interacted validity states. */
  assumeInteractionOn: string[];

  /**
   * An array of event names to listen to. When ANY events in the list are emitted, the control will check
   * it's validity state.
   */
  checkValidityOn: string[];

  /**
   * An array of event names to listen to. When ANY events in the list are emitted, the control will check
   * it's validity state and update the host element immediately.
  */
  updateValidityOn: string[];
}

export class FormControlController implements ReactiveController {
  host: RosellaFormControl;
  readonly internals: ElementInternals;
  form?: HTMLFormElement | null;
  options: FormControlControllerOptions;

  private userInteractedControls = new WeakSet<RosellaFormControl>();

  constructor(host: RosellaFormControl, internals: ElementInternals, options: Partial<FormControlControllerOptions> = {}) {
    (this.host = host).addController(this);

    this.internals = internals;

    this.options = {
      form: (input): HTMLFormElement | null => {
        // If there's a form attribute, use it to find the target form by id
        // Controls may not always reflect the 'form' property. For example, `<sl-button>` doesn't reflect.
        const formId = input.associatedForm;

        if (formId) {
          const root = input.getRootNode() as Document | ShadowRoot | HTMLElement;
          const form = root.querySelector(`#${formId}`);

          if (form) {
            return form as HTMLFormElement;
          }
        }

        return this.internals.form;
      },
      name: input => input.name,
      value: input => input.value,
      defaultValue: input => input.defaultValue,
      disabled: input => input.disabled ?? false,
      reportValidity: input => (typeof input.reportValidity === 'function' ? input.reportValidity() : true),
      checkValidity: input => (typeof input.checkValidity === 'function' ? input.checkValidity() : true),
      setValue: (input, value) => (input.value = value),
      assumeInteractionOn: ['ui-input'],
      checkValidityOn: ['ui-blur'],
      updateValidityOn: ['ui-input'],
      ...options
    };
  }

  hostConnected() {
    const form = this.options.form(this.host);

    if (form) {
      this.attachForm(form);
    }

    // Listen for interactions
    interactions.set(this.host, []);

    this.options.assumeInteractionOn.forEach(event => {
      this.host.addEventListener(event, this.handleInteraction);
    });

    // this.options.checkValidityOn.forEach(event => {
    //   this.host.addEventListener(event, this.updateValidity);
    // });

    this.options.updateValidityOn.forEach(event => {
      this.host.addEventListener(event, () => {
        console.log('update validity');
        this.updateValidity();
      });
    });

    this.host.addEventListener('invalid', (e: Event) => {
      e.preventDefault();

      const hasInteracted = Boolean(this.userInteractedControls.has(this.host));

      if (hasInteracted) {
        this.internals.states.add('--user-invalid');
      }

      this.internals.states.add('--invalid');
    });
  }

  private attachForm(form?: HTMLFormElement | null) {
    if (form) {
      this.form = form;

      if (!form.userInteractedControls) {
        form.userInteractedControls = new WeakSet<RosellaFormControl>();
      }

      // Add this element to the form's collection
      if (formCollections.has(this.form)) {
        formCollections.get(this.form)!.add(this.host);
      } else {
        formCollections.set(this.form, new Set<RosellaFormControl>([this.host]));
      }

      // this.form?.addEventListener('formdata', this.handleFormData);
      // this.form?.addEventListener('submit', this.handleFormSubmit);
      // this.form?.addEventListener('reset', this.handleFormReset);

      // // Overload the form's reportValidity() method so it looks at Shoelace form controls
      // if (!reportValidityOverloads.has(this.form)) {
      //   reportValidityOverloads.set(this.form, this.form.reportValidity);
      //   this.form.reportValidity = () => this.reportFormValidity();
      // }

      // // Overload the form's checkValidity() method so it looks at Shoelace form controls
      // if (!checkValidityOverloads.has(this.form)) {
      //   checkValidityOverloads.set(this.form, this.form.checkValidity);
      //   this.form.checkValidity = () => this.checkFormValidity();
      // }
    } else {
      this.form = undefined;
    }
  }

  private setUserInteracted(el: RosellaFormControl, hasInteracted: boolean) {
    if (hasInteracted) {
      userInteractedControls.add(el);
    } else {
      userInteractedControls.delete(el);
    }

    el.requestUpdate();
  }

  private handleInteraction = (event: Event) => {
    const emittedEvents = interactions.get(this.host)!;

    if (!emittedEvents.includes(event.type)) {
      emittedEvents.push(event.type);
    }

    // Mark it as user-interacted as soon as all associated events have been emitted
    if (emittedEvents.length === this.options.assumeInteractionOn.length) {
      this.setUserInteracted(this.host, true);
    }
  };

  private doAction(type: 'submit' | 'reset', submitter?: HTMLInputElement | Button) {
    if (this.form) {
      const button = document.createElement('button');
      button.type = type;
      button.style.position = 'absolute';
      button.style.width = '0';
      button.style.height = '0';
      button.style.clipPath = 'inset(50%)';
      button.style.overflow = 'hidden';
      button.style.whiteSpace = 'nowrap';

      // Pass name, value, and form attributes through to the temporary button
      if (submitter) {
        button.name = submitter.name;
        button.value = submitter.value;

        ['formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'].forEach(attr => {
          if (submitter.hasAttribute(attr)) {
            button.setAttribute(attr, submitter.getAttribute(attr)!);
          }
        });
      }

      this.form.append(button);
      button.click();
      button.remove();
    }
  }

  /** Returns the associated `<form>` element, if one exists. */
  getForm() {
    return this.internals.form;
  }

  setFormValue(value: any) {
    this.internals.setFormValue(value);
  }

  /** Resets the form, restoring all the control to their default value */
  reset(submitter?: HTMLInputElement | Button) {
    this.doAction('reset', submitter);
  }

  /** Submits the form, triggering validation and form data injection. */
  submit(submitter?: HTMLInputElement | Button) {
    // Calling form.submit() bypasses the submit event and constraint validation. To prevent this, we can inject a
    // native submit button into the form, "click" it, then remove it to simulate a standard form submission.
    this.doAction('submit', submitter);
  }

  /**
   * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
   * the host element immediately, i.e. before Lit updates the component in the next update.
   */
  setValidity(_: boolean) {
    // const states = this.host._internals.states;
    // const hasInteracted = Boolean(this.userInteractedControls.has(this.host));
    // const required = Boolean(host.required);

    //
    // We're mapping the following "states" to data attributes. In the future, we can use ElementInternals.states to
    // create a similar mapping, but instead of [data-invalid] it will look like :--invalid.
    //
    // See this RFC for more details: https://github.com/shoelace-style/shoelace/issues/1011
    //
    // host.toggleAttribute('data-required', required);
    // host.toggleAttribute('data-optional', !required);
    // host.toggleAttribute('data-invalid', !isValid);
    // if (!isValid) {
    //   console.log('invalid')
    //   states.add('--invalid');
    // }
    // host.toggleAttribute('data-valid', isValid);
    // if (!isValid && hasInteracted) {
    //   states.add('--user-invalid');
    // }
    // host.toggleAttribute('data-user-valid', isValid && hasInteracted);
  }

  /**
   * Updates the form control's `CustomStateSet` and shows any validation messages. This will also
   * remove the `--invalid` and `--user-invalid` states if the control is valid.
   */
  reportValidity(): boolean {
    const validity = this.internals.validity;

    if (validity.valid) {
      this.internals.states.delete('--invalid');
      this.internals.states.delete('--user-invalid');
    } else {
      const hasInteracted = Boolean(this.userInteractedControls.has(this.host));

      if (hasInteracted) {
        this.internals.states.add('--user-invalid');
      }

      this.internals.states.add('--invalid');
    }

    return this.internals.validity.valid;
  }

  /**
   * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
   * that affects constraint validation changes so the component receives the correct validity states.
   */
  updateValidity() {
    const validity = this.host.validity;

    this.internals.setValidity(validity, 'hi');

    if (validity.valid) {
      this.reportValidity();
    }
  }
}

// A validity state object that represents `valid`
export const validValidityState: ValidityState = Object.freeze({
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false
});
