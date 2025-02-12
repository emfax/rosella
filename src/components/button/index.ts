import Button from './button.component';

Button.define('ui-button');

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': Button;
  }
}

export default Button;