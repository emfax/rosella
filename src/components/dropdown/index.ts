import Dropdown from './dropdown.component';

Dropdown.define('ui-dropdown');

declare global {
  interface HTMLElementTagNameMap {
    'ui-dropdown': Dropdown;
  }
}

export default Dropdown;