import { css } from 'lit';

export default css`
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

  input:focus {
    outline: none;
  }

  input:focus-visible {
    outline: none;
  }

  input::placeholder {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-light);
    user-select: none;
    -webkit-user-select: none;
  }

  .input {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--color-base-300);
    overflow: hidden;
  }

  .input:focus-within {
    border-color: var(--color-primary-500);
  }

  .input.sm {
    border-radius: var(--radius-sm);
    height: calc(var(--spacing) * 6);
    padding: 0 var(--spacing-xs);
  }

  .input.md {
    border-radius: var(--radius-md);
    height: calc(var(--spacing) * 8);
    padding: 0 var(--spacing-sm);
  }

  .input.lg {
    border-radius: var(--radius-md);
    font-size: var(--text-lg);
    height: calc(var(--spacing) * 12);
    padding: 0 var(--spacing-md);
  }

  :host(:state(--invalid)) .input {
    border-color: var(--color-red-500);
  }

  :host(:state(--invalid)) .input:focus-within {
    border-color: var(--color-red-700);
  }

  .listbox {
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