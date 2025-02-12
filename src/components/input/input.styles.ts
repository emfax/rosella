import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  input {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--color-base-800);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input {
    flex: 1 1 auto;
    position: relative;
    display: flex;
    align-items: stretch;
    border: 1px solid var(--color-base-500);
    overflow: hidden;
  }

  .input:focus-within {
    border-color: var(--color-primary-500);
  }

  input::placeholder {
    color: var(--color-base-600);
    font-weight: var(--font-weight-light);
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:state(--invalid)) .input {
    border-color: var(--color-red-500);
  }

  :host(:state(--invalid)) .input:focus-within {
    border-color: var(--color-red-700);
  }

  .input.small {
    border-radius: var(--radius-sm);
    height: calc(var(--spacing) * 6);
    padding: 0 var(--spacing-xs);
  }

  .input.medium {
    border-radius: var(--radius-md);
    height: calc(var(--spacing) * 8);
    padding: 0 var(--spacing-sm);
  }

  .input.large {
    border-radius: var(--radius-md);
    font-size: var(--text-lg);
    height: calc(var(--spacing) * 12);
    padding: 0 var(--spacing-md);
  }

  input:focus {
    outline: none;
  }

  input::-webkit-search-decoration,
  input::-webkit-search-cancel-button,
  input::-webkit-search-results-button,
  input::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
  
  label.required::after {
    content: '*';
  }

  .help-text {
    color: var(--color-base-600);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-light);
  }
`;