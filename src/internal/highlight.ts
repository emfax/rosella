import { ReactiveController } from "lit";
import type Option from "../components/option";
import MenuItem from "../components/menu-item";

export class HighlightController implements ReactiveController {
  host: Option | MenuItem;
  internals: ElementInternals

  constructor(host: Option | MenuItem, internals: ElementInternals) {
    (this.host = host).addController(this);

    this.internals = internals;
  }

  hostConnected(): void {
    this.host.addEventListener('mouseenter', this.highlight);
    this.host.addEventListener('mouseleave', this.unhighlight);
  }

  private highlight = (): void => {
    this.internals.states.add('--highlight');
  }

  private unhighlight = (): void => {
    this.internals.states.delete('--highlight');
  }
}
