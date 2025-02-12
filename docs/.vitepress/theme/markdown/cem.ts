
import { MarkdownRenderer } from 'vitepress';
import customElementsManifest from "../../../../dist/custom-elements.json";
import { render } from 'lit';

const pattern = /^\[\[cem\]\]$/i;

function generateHeading(state: any, level: number, content: string) {
  const token_o = state.push('heading_open', 'h' + String(level), 1);
  token_o.markup = '########'.slice(0, level);
  // token_o.map = [startLine, state.line];

  const token_i = state.push('inline', '', 0)
  token_i.content = content;
  // token_i.map = [startLine, state.line]
  token_i.children = [];

  const token_c = state.push('heading_close', 'h' + String(level), -1);
  token_c.markup = '########'.slice(0, level)
}

function generateTableHead(state: any, headings: string[]) {
  state.push('table_open', 'table', 1);
  state.push('thead_open', 'thead', 1);
  state.push('tr_open', 'tr', 1);

  for (const heading of headings) {
    state.push('th_open', 'th', 1);
    const tok_il = state.push('inline', '', 0);
    tok_il.content = heading;
    tok_il.children = [];
    state.push('th_close', 'th', -1);
  }

  state.push('tr_close', 'tr', -1);
  state.push('thead_close', 'thead', -1);
}

function generateAttributes(state: any, attributes: any[]) {
  generateHeading(state, 2, 'Attributes');

  generateTableHead(state, ['Name', 'Description']);

  state.push('tbody_open', 'tbody', 1);

  for (const attribute of attributes) {
    state.push('tr_open', 'tr', 1);

    state.push('td_open', 'td', 1);
    const tok_il_name = state.push('inline', '', 0);
    tok_il_name.content = attribute.name;
    tok_il_name.children = [];
    state.push('td_close', 'td', -1);

    state.push('td_open', 'td', 1);
    const tok_il_td_desc = state.push('inline', '', 0);
    tok_il_td_desc.content = attribute.description ? attribute.description : '';
    tok_il_td_desc.children = [];
    state.push('td_close', 'td', -1);

    state.push('tr_close', 'tr', -1);
  }

  state.push('tbody_close', 'tbody', -1);
  state.push('table_close', 'table', -1);
}

function generateProperties(state: any, properties: any[]) {
  generateHeading(state, 2, 'Instance Properties');

  generateTableHead(state, ['Name', 'Description']);

  properties = properties.filter((property) => property.privacy !== 'private');

  state.push('tbody_open', 'tbody', 1);

  for (const property of properties) {
    state.push('tr_open', 'tr', 1);

    state.push('td_open', 'td', 1);
    const tok_il_name = state.push('inline', '', 0);
    tok_il_name.content = property.name;
    tok_il_name.children = [];
    state.push('td_close', 'td', -1);

    state.push('td_open', 'td', 1);
    const tok_il_td_desc = state.push('inline', '', 0);
    tok_il_td_desc.content = property.description ?? '';
    tok_il_td_desc.children = [];
    state.push('td_close', 'td', -1);

    state.push('tr_close', 'tr', -1);
  }

  state.push('tbody_close', 'tbody', -1);
  state.push('table_close', 'table', -1);
}

function generateMethods(state: any, methods: any[]) {
  generateHeading(state, 2, 'Instance Methods');

  generateTableHead(state, ['Name', 'Description']);

  state.push('tbody_open', 'tbody', 1);

  for (const method of methods) {
    state.push('tr_open', 'tr', 1);

    state.push('td_open', 'td', 1);
    const tok_il_name = state.push('inline', '', 0);
    tok_il_name.content = method.name;
    tok_il_name.children = [];
    state.push('td_close', 'td', -1);

    state.push('td_open', 'td', 1);
    const tok_il_td_desc = state.push('inline', '', 0);
    tok_il_td_desc.content = method.description ?? '';
    tok_il_td_desc.children = [];
    state.push('td_close', 'td', -1);

    state.push('tr_close', 'tr', -1);
  }

  state.push('tbody_close', 'tbody', -1);
  state.push('table_close', 'table', -1);
}

function generateSlots(state: any, slots: any[]) {
  generateHeading(state, 2, 'Slots');

  generateTableHead(state, ['Name', 'Description']);

  state.push('tbody_open', 'tbody', 1);

  for (const slot of slots) {
    state.push('tr_open', 'tr', 1);

    state.push('td_open', 'td', 1);
    const tok_il_name = state.push('inline', '', 0);
    tok_il_name.content = slot.name;
    tok_il_name.children = [];
    state.push('td_close', 'td', -1);

    state.push('td_open', 'td', 1);
    const tok_il_td_desc = state.push('inline', '', 0);
    tok_il_td_desc.content = slot.description ?? '';
    tok_il_td_desc.children = [];
    state.push('td_close', 'td', -1);

    state.push('tr_close', 'tr', -1);
  }

  state.push('tbody_close', 'tbody', -1);
  state.push('table_close', 'table', -1);
}

function findDeclaration(name: string) {
  for (const module of customElementsManifest.modules) {
    for (const declaration of module.declarations) {
      if (declaration.tagName === name) {
        return declaration;
      }
    }
  }
}

function generateCem(state: any) {
  const declaration = findDeclaration(state.env.frontmatter.tag);

  if (!declaration) {
    state.line += 1;

    const error = state.push('inline');

    error.content = 'ERROR: Could not find declaration';

    return;
  }

  if (Array.isArray(declaration.attributes) && declaration.attributes.length > 0) {
    generateAttributes(state, declaration.attributes);
  }

  if (Array.isArray(declaration.members) && declaration.members.length > 0) {
    let properties = declaration.members.filter((member) => member.kind === 'field' && member.privacy !== 'private');
    if (properties.length > 0) {
      generateProperties(state, properties);
    }

    let methods = declaration.members.filter((member) => member.kind === 'method' && member.privacy !== 'private');
    if (methods.length > 0) {
      generateMethods(state, methods);
    }
  }

  if (Array.isArray(declaration.slots) && declaration.slots.length > 0) {
    generateSlots(state, declaration.slots);
  }
}

/**
 * Forked and modified from markdown-it-toc-done-right
 *
 * - remove the `inlineOptions` support
 * - use markdown-it default renderer to render token whenever possible
 *
 * @see https://github.com/nagaozen/markdown-it-toc-done-right
 */
const createCemBlockRule =
  () =>
    (state, startLine, endLine, silent): boolean => {
      // if it's indented more than 3 spaces, it should be a code block
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }

      const pos = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];

      // use whitespace as a line tokenizer and extract the first token
      // to test against the placeholder anchored pattern, rejecting if false
      const lineFirstToken = state.src.slice(pos, max).split(' ')[0];

      if (!pattern.test(lineFirstToken)) return false;

      if (silent) return true;

      // generate toc_open token
      // will be rendered by markdown-it default renderer
      // const tokenOpen = state.push('cem_open', containerTag, 1);
      // tokenOpen.markup = '';
      // tokenOpen.map = [startLine, state.line];
      // if (containerClass) {
      //   tokenOpen.attrSet('class', containerClass);
      // }

      // generate toc_body token
      // will be rendered by our custom renderer
      state.line = startLine + 1;

      console.log(state.env)

      generateCem(state);
      // const tokenBody = state.push('cem_body', '', 0);
      // tokenBody.markup = lineFirstToken;
      // tokenBody.map = [startLine, state.line];
      // tokenBody.hidden = true;

      // generate toc_close token
      // will be rendered by markdown-it default renderer
      // const tokenClose = state.push('cem_close', containerTag, -1);
      // tokenClose.markup = '';
      // tokenBody.map = [startLine, state.line];

      return true;
    };

function renderCem(declaration: any): string {
  let result = '';

  if (Array.isArray(declaration.attributes) && declaration.attributes.length > 0) {
    result += '<h2>Attributes</h2>'
  }

  return result;
}

export default (
  md: MarkdownRenderer,
): void => {
  // add toc syntax as a block rule
  md.block.ruler.before(
    'heading',
    'cem',
    createCemBlockRule(),
  );

  // create the headers renderer from the options
  // const renderHeaders = createRenderHeaders({
  //   listTag,
  //   listClass,
  //   itemClass,
  //   linkTag,
  //   linkClass,
  // });

  // custom toc_body render rule
  // Notice that markdown-it-toc-done-right collects ast (i.e. headers) by pushing a custom ruler,
  // that's good because it ensures we only collect headers once. However the collected headers
  // are possible to be overridden by calling `md.render` / `md.renderInline` before the toc_body
  // is rendered (like https://github.com/vuejs/vitepress/issues/1093).
  // Here we changed to collect headers during rendering toc_body. The drawback is that it is possible
  // to collect headers multiple times if there are more than one toc_body, which is acceptable because
  // in most cases there is only one toc per page.
  // md.renderer.rules.cem_body = (tokens, idx, options, env, self) => {
  //   const declaration = findDeclaration(env.frontmatter.tag);

  //   if (!declaration) {
  //     return `<div>ERROR: Could not find declaration</div>`;
  //   }

  //   return renderCem(declaration);
  // }
};