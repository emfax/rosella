---
title: "Select"
aside: true
tag: "ui-select"
---

# {{ $frontmatter.title }}

Fully styled `select` element.

## Examples

#### Select with label

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-select label="Color" placeholder="Select color">
    <div class="p-xs">
      <ui-option class="px-sm rounded" value="purple">Purple</ui-option>
      <ui-option class="px-sm rounded" value="green">Green</ui-option>
      <ui-option class="px-sm rounded" value="orange">Orange</ui-option>
    </div>
  </ui-select>
</div>
```

:::

#### Input with label and help text

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-select label="Color" placeholder="Select color" help-text="Please select a colour">
    <div class="p-xs">
      <ui-option class="px-sm rounded" value="purple">Purple</ui-option>
      <ui-option class="px-sm rounded" value="green">Green</ui-option>
      <ui-option class="px-sm rounded" value="orange">Orange</ui-option>
    </div>
  </ui-select>
</div>
```

:::

#### Sizes

Use the `size` attribute to change a Select's size

::: html-preview

```html
<div class="mx-auto max-w-xs space-y-sm">
  <ui-select label="Small" placeholder="Select color" size="sm">
    <div class="p-xs">
      <ui-option class="px-sm rounded" value="purple">Purple</ui-option>
      <ui-option class="px-sm rounded" value="green">Green</ui-option>
      <ui-option class="px-sm rounded" value="orange">Orange</ui-option>
    </div>
  </ui-select>
  <ui-select label="Large" placeholder="Select color" size="lg">
    <div class="p-xs">
      <ui-option class="px-sm rounded" value="purple">Purple</ui-option>
      <ui-option class="px-sm rounded" value="green">Green</ui-option>
      <ui-option class="px-sm rounded" value="orange">Orange</ui-option>
    </div>
  </ui-select>
</div>
```

:::

#### Usage in forms

Selects play nice in native `form` elements. They participate in form validation.

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <form class="space-y-md">
    <ui-select label="Color" placeholder="Select color" required>
      <div class="p-xs">
        <ui-option class="px-sm rounded" value="purple">Purple</ui-option>
        <ui-option class="px-sm rounded" value="green">Green</ui-option>
        <ui-option class="px-sm rounded" value="orange">Orange</ui-option>
      </div>
    </ui-select>
    <ui-button type="submit">Submit</ui-button>
  </form>
</div>
```

:::

[[cem]]