export type UiConnectedEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'ui-connect': UiConnectedEvent;
  }
}