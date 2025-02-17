import Menu from './menu.component';

Menu.define('ui-menu');

declare global {
  interface HTMLElementTagNameMap {
    'ui-menu': Menu;
  }
}

export default Menu;