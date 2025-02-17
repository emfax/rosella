export type UiSelectEvent = CustomEvent<Record<PropertyKey, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'ui-select': UiSelectEvent;
  }
}