import { css } from 'lit';

export default css`
  :host {
    display: block;
    outline: none;
    -webkit-appearance: none;
  }
  
  /* Provide basic, default focus styles. */
  :host(:focus) {
  outline: none;
    -webkit-appearance: none;
  }
    
    /*
    	Remove default focus styles for mouse users ONLY if
    	:focus-visible is supported on this platform.
    */
    :host(:focus:not(:focus-visible))  {
      outline: none;
      -webkit-appearance: none;
    }
    
    /*
      Optionally: If :focus-visible is supported on this
      platform, provide enhanced focus styles for keyboard
      focus.
    */
     

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border: none;
    width: 100%;
    -webkit-appearance: none;
  }

  :host(:focus-visible) button {
    box-shadow: 0 0 0 2px var(--color-primary-500);
  }


  .default {
    background-color: var(--color-base-700);
    color: var(--color-base-100);
  }

  .default:hover {
    background-color: var(--color-base-600);
  }

  .primary {
    background-color: var(--color-primary-500);
    color: var(--color-primary-800);
  }

  .primary:hover {
    background-color: var(--color-primary-400);
  }

  .secondary {
    background-color: var(--color-base-100);
    color: var(--color-base-800);
    border-color: var(--color-base-300);
    border-width: var(--border-width);
    border-style: solid;
  }

  .secondary:hover {
    background-color: var(--color-base-200);
  }

  .success {
    background-color: var(--color-green-500);
    color: var(--color-green-100);
  }

  .success:hover {
    background-color: var(--color-green-600);
  }

  .danger {
    background-color: var(--color-red-500);
    color: var(--color-red-200);
  }

  .danger:hover {
    background-color: var(--color-red-600);
  }

  .text {
    color: var(--color-base-800);
  }

  .text:hover {
    background-color: var(--color-base-200);
  }

  .xs {
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    height: calc(var(--spacing) * 5);
    padding: 0 var(--spacing-xs);
  }

  .sm {
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    height: calc(var(--spacing) * 6);
    padding: 0 var(--spacing-xs);
  }

  .md {
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    height: calc(var(--spacing) * 8);
    padding: 0 var(--spacing-sm);
  }

  .lg {
    border-radius: var(--radius-md);
    font-size: var(--text-md);
    height: calc(var(--spacing) * 10);
    padding: 0 var(--spacing-md);
  }

  .xl {
    border-radius: var(--radius-md);
    font-size: var(--text-lg);
    height: calc(var(--spacing) * 14);
    padding: 0 var(--spacing-lg);
  }
`;