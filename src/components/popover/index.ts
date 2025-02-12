import Popover from "./popover";

Popover.define("ui-popover");

declare global {
  interface HTMLElementTagNameMap {
    "ui-popover": Popover;
  }
}

export default Popover;