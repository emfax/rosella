export type UiSelectEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'ui-select': UiSelectEvent;
  }
}