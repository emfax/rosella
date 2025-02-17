---
title: "Dropdown"
aside: true
tag: ui-dropdown
---

# {{ $frontmatter.title }}

## Examples

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-dropdown>
    <ui-button slot="trigger" variant="secondary">
      <span>Button</span>
      <ui-icon slot="suffix" name="chevron-down"></ui-icon>
    </ui-button>
    <ui-menu>
      <ui-menu-item value="one">One</ui-menu-item>
      <ui-menu-item value="two">Two</ui-menu-item>
      <ui-menu-item value="three">Three</ui-menu-item>
    </ui-menu>
  </ui-dropdown>
</div>
```

:::