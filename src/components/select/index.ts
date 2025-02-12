import Select from './select.component';

Select.define('ui-select');

declare global {
  interface HTMLElementTagNameMap {
    'ui-select': Select;
  }
}

export default Select;