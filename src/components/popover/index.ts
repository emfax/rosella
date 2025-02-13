import Popover from "./popover.component";

Popover.define("ui-popover");

declare global {
  interface HTMLElementTagNameMap {
    "ui-popover": Popover;
  }
}

export default Popover;