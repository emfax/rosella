import Tab from './tab.component';

Tab.define('ui-tab');

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab': Tab;
  }
}

export default Tab;