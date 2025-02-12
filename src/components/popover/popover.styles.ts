import { css } from 'lit';

export default css`
  :host {
    display: contents;
    position: relative;
  }

  .popover {
    display: none;
  }

  .popover.active {
    display: block;
  }
`;