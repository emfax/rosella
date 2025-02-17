---
title: "Menu"
aside: true
tag: ui-menu
---

# {{ $frontmatter.title }}

## Examples

#### Basic

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-menu>
    <ui-menu-item value="one">One</ui-menu-item>
    <ui-menu-item value="two">Two</ui-menu-item>
    <ui-menu-item value="three">Three</ui-menu-item>
  </ui-menu>
</div>
```

:::

#### With submenus

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-menu>
    <ui-menu-item value="one">One</ui-menu-item>
    <ui-menu-item value="two">Two</ui-menu-item>
    <ui-menu-item value="three">Three</ui-menu-item>
    <ui-menu-item label="Four">
      <ui-menu slot="submenu">
        <ui-menu-item value="one">One</ui-menu-item>
        <ui-menu-item value="two">Two</ui-menu-item>
        <ui-menu-item value="three">Three</ui-menu-item>
      </ui-menu>
    </ui-menu-item>
  </ui-menu>
</div>
```

:::