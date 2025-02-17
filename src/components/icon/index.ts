import Icon from './icon.component';

Icon.define('ui-icon');

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon': Icon;
  }
}

export default Icon;