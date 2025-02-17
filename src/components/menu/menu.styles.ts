import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;
    background: var(--color-base-100);
    border: solid 1px var(--color-base-200) !important;
    border-radius: var(--radius-lg);
    padding: var(--spacing-xs);
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(ui-divider) {
    --spacing: var(--spacing-xs);
  }
`;