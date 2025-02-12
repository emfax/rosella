---
title: Tab Panel
aside: true
tag: ui-tab-panel
---

# {{ $frontmatter.title }}

`TabPanel` is used in conjunction with `TabGroups` and `Tabs`.

## Examples

::: html-preview

```html
<div class="mx-auto max-w-sm">
  <ui-tab-group class="border border-base-300 rounded">
    <ui-tab slot="tabs" panel="general" active>General</ui-tab>
    <ui-tab slot="tabs" panel="roles">Roles</ui-tab>
    <ui-tab slot="tabs" panel="advanced">Advanced</ui-tab>
    <ui-tab-panel name="general" active>
        <div class="p-sm">
            General
        </div>
    </ui-tab-panel>
    <ui-tab-panel name="roles">
        <div class="p-sm">
            Roles
        </div>
    </ui-tab-panel>
    <ui-tab-panel name="advanced">
        <div class="p-sm">
            Advanced
        </div>
    </ui-tab-panel>
  </ui-tab-group>
</div>
```

:::

[[cem]]