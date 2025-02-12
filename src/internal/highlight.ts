import { ReactiveController } from "lit";
import type Option from "../components/option";

let highlighted: Option | null = null;

export class HighlightController implements ReactiveController {
  host: Option;
  internals: ElementInternals

  constructor(host: Option, internals: ElementInternals) {
    (this.host = host).addController(this);

    this.internals = internals;
  }

  hostConnected(): void { }

  highlight(): void {
    if (highlighted !== this.host) {
      highlighted?.unhighlight();
    }

    highlighted = this.host;
    this.internals.states.add('--highlight');
  }

  unhighlight(): void {
    this.internals.states.delete('--highlight');
  }
}

export function unhighlightAll(): void {
  highlighted?.unhighlight();

  highlighted = null;
}