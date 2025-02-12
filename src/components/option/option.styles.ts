import { css } from 'lit';

export default css`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  :host(:state(--highlight)) {
    background-color: var(--color-base-200);
  }
`;