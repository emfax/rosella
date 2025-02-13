import { css } from 'lit';

export default css`
  :host {
    display: contents;
    position: relative;
  }

  .popover {
    background-color: var(--color-base-100);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-base-200);
    color: var(--color-base-800);
    font-size: var(--text-sm);
    margin: 0;
    outline: none;
    overflow: hidden;
    position: absolute;
    min-width: var(--container-4xs);
  }
`;