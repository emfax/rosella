import TabGroup from './tab-group.component';

TabGroup.define('ui-tab-group');

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab-group': TabGroup;
  }
}

export default TabGroup;