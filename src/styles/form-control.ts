import { css } from 'lit';

export default css`
  label {
    color: var(--color-base-800);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
  }

  :host([required]) label::after {
    content: '*';
  }

  .form-control__help-text {
    color: var(--color-base-600);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-light);
  }
`;