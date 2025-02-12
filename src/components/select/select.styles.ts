import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  #value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .expand-icon {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    height: var(--text-base);
    width: var(--text-base);
  }
`;