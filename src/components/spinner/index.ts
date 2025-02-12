import Spinner from './spinner.component';

Spinner.define('ui-spinner');

declare global {
  interface HTMLElementTagNameMap {
    'ui-spinner': Spinner;
  }
}

export default Spinner;