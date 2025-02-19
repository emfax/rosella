import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  :host([size='sm']) {
    width: var(--text-base);
    height: var(--text-base);
  }

  :host([size='md']) {
    width: var(--text-xl);
    height: var(--text-xl);
  }

  :host([size='lg']) {
    width: var(--text-2xl);
    height: var(--text-2xl);
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  :host([size='md']) svg {
    stroke-width: 1.75;
  }

  :host([size='lg']) svg {
    stroke-width: 2;
  }
`;