export type UiSubmitEvent = CustomEvent<Record<PropertyKey, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'ui-submit': UiSubmitEvent;
  }
}