import TabPanel from './tab-panel.component';

TabPanel.define('ui-tab-panel');

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab-panel': TabPanel;
  }
}

export default TabPanel;