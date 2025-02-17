---
title: "Popover"
aside: true
tag: ui-popover
---

# {{ $frontmatter.title }}

## Examples

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-popover>
    <ui-button slot="anchor">
      <span>Button</span>
      <ui-icon slot="suffix" name="chevronDown"></ui-icon>
    </ui-button>
    <ui-menu>
      <ui-menu-item value="one">One</ui-menu-item>
      <ui-menu-item value="two">Two</ui-menu-item>
      <ui-menu-item value="three">Three</ui-menu-item>
    </ui-menu>
  </ui-popover>
</div>
```

:::