import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;
    background: inherit;
    border-radius: var(--radius-lg);
    color: var(--color-base-600);
    font-size: var(--text-sm);
    padding: var(--spacing-xs);
    overflow: hidden;
  }

  :host(:state(--highlight)) {
    background-color: var(--color-base-200);
    color: var(--color-base-800);
  }

  .label-container {
    flex: 1 1 auto;
  }

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .sub-menu {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    oultine: none;
    width: max-content;
  }
`;