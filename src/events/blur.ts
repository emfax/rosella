export type UiBlurEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'ui-blur': UiBlurEvent;
  }
}