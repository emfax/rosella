---
title: Tables
aside: true
---

# {{ $frontmatter.title }}

Rosella doesn't include web component based tables, but instead provides some builtin styles for tables.

## Examples

::: html-preview

```html
<div class="flex mx-auto max-w-md not-prose">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Kind</th>
        <th data-type="number">Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Apple</td>
        <td>Fruit</td>
        <td data-type="number">1</td>
      </tr>
      <tr>
        <td>Orange</td>
        <td>Fruit</td>
        <td data-type="number">1</td>
      </tr>
      <tr>
        <td>Banana</td>
        <td>Fruit</td>
        <td data-type="number">1</td>
      </tr>
      <tr>
        <td>Parsnip</td>
        <td>Unknown</td>
        <td data-type="number">1</td>
      </tr>
    </tbody>
  </table>
</div>
```

:::