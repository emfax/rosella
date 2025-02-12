import Option from './option.component';

Option.define('ui-option');

declare global {
  interface HTMLElementTagNameMap {
    'ui-option': Option;
  }
}

export default Option;