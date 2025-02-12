import { css } from 'lit';

export default css`
  .tab {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    padding-block: var(--spacing-md);
    padding-inline: var(--spacing-md);
    user-select: none;
    -webkit-user-select: none;
    cursor: default;
  }

  :host([active]) {
    color: var(--color-base-800);
  }
`;