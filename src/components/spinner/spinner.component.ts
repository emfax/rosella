import { html } from 'lit';
import RosellaElement from '../../element/rosella-element.js';
import styles from './spinner.styles';
import type { CSSResultGroup } from 'lit';

/**
 * @summary Spinners are used to show the progress of an indeterminate operation.
 * @documentation https://rosel.la/components/spinner
 * @tag ui-spinner
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the spinner's indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
export default class Spinner extends RosellaElement {
  static styles: CSSResultGroup = [styles];

  render() {
    return html`
      <svg part="base" class="spinner" role="progressbar" aria-label="loading">
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
}