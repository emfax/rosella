---
title: Input
aside: true
tag: 'ui-input'
---

# {{ $frontmatter.title }}

Batteries included `input` element.

## Examples

#### Input with label

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-input label="Email" placeholder="you@example.com" />
</div>
```

:::

#### Input with label and help text

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <ui-input label="Email" placeholder="you@example.com" help="Please provide a valid email address" />
</div>
```

:::

#### Sizes

Use the `size` attribute to change an input's size

::: html-preview

```html
<div class="mx-auto max-w-xs space-y-sm">
  <ui-input size="small" />
  <ui-input />
  <ui-input size="large" />
</div>
```

:::

#### Usage in forms

Inputs play nice in native `form` elements. They participate in form validation.

::: html-preview

```html
<div class="mx-auto max-w-xs">
  <form class="space-y-md">
    <ui-input label="Name" placeholder="you@example.com" required />
    <ui-input label="Email" placeholder="you@example.com" type="email" required />
    <ui-button type="submit">Submit</ui-button>
  </form>
</div>
```

:::

[[cem]]