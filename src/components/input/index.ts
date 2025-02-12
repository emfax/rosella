import Input from './input.component';

Input.define('ui-input');

declare global {
  interface HTMLElementTagNameMap {
    'ui-input': Input;
  }
}

export default Input;