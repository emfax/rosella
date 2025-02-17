import MenuItem from './menu-item.component';

MenuItem.define('ui-menu-item');

declare global {
  interface HTMLElementTagNameMap {
    'ui-menu-item': MenuItem;
  }
}

export default MenuItem;