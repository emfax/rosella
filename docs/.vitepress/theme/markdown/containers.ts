import type { MarkdownRenderer, MarkdownOptions } from 'vitepress';
import container from 'markdown-it-container';
import { render } from 'vue';

let defaultFenceRenderer: any;

export default (
  md: MarkdownRenderer,
  options: MarkdownOptions,
) => {
  md.use(container, 'html-preview', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        let tabs: string[] = [];
        let panels: string[] = [];

        for (
          let i = idx + 1;
          !(
            tokens[i].nesting === -1 &&
            tokens[i].type === 'container_html-preview_close'
          );
          ++i
        ) {
          if (tokens[i].info.startsWith('html')) {
            let classes = tokens[i].info.split(':')[1];

            tabs.unshift(`<ui-tab slot="tabs" panel="html">HTML</ui-tab>`);
            tabs.unshift(`<ui-tab slot="tabs" panel="preview" active>Preview</ui-tab>`);
            panels.unshift(`<ui-tab-panel class="p-md" name="preview" active><div ${classes ? 'class="classes"' : ''}>${tokens[i].content}</div></ui-tab-panel>`);
          } else if (tokens[i].type === 'fence') {
            tabs.push(`<ui-tab slot="tabs" panel="${tokens[i].info}">${tokens[i].info}</ui-tab>`);
          }
        }

        defaultFenceRenderer = md.renderer.rules.fence;

        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          return `<ui-tab-panel class="p-md vp-doc" name="${tokens[idx].info}">${defaultFenceRenderer(tokens, idx, options, env, self)}</ui-tab-panel>`;
        }

        return `<div><ui-tab-group class="border border-color-base rounded">${tabs.join('')}${panels.join('')}\n`
      }

      md.renderer.rules.fence = defaultFenceRenderer;

      return `</ui-tab-group></div>\n`
    }
  });
}

// function createCodeGroup(options: MarkdownOptions, md: MarkdownRenderer) {
//   return [
//     container,
//     'code-group',
//     {
//       render(tokens, idx) {
//         if (tokens[idx].nesting === 1) {
//           const name = nanoid(5)
//           let tabs = ''
//           let checked = 'checked'

//           for (
//             let i = idx + 1;
//             !(
//               tokens[i].nesting === -1 &&
//               tokens[i].type === 'container_code-group_close'
//             );
//             ++i
//           ) {
//             const isHtml = tokens[i].type === 'html_block'

//             if (
//               (tokens[i].type === 'fence' && tokens[i].tag === 'code') ||
//               isHtml
//             ) {
//               const title = extractTitle(
//                 isHtml ? tokens[i].content : tokens[i].info,
//                 isHtml
//               )

//               if (title) {
//                 const id = nanoid(7)
//                 tabs += `<input type="radio" name="group-${name}" id="tab-${id}" ${checked}><label data-title="${md.utils.escapeHtml(title)}" for="tab-${id}">${title}</label>`

//                 if (checked && !isHtml) tokens[i].info += ' active'
//                 checked = ''
//               }
//             }
//           }

//           return `<div class="vp-code-group${getAdaptiveThemeMarker(
//             options
//           )}"><div class="tabs">${tabs}</div><div class="blocks">\n`
//         }
//         return `</div></div>\n`
//       }
//     }
//   ]
// }