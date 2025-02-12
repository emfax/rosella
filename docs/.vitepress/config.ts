import { defineConfigWithTheme } from 'vitepress';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import containersPlugin from './theme/markdown/containers';
import cemPlugin from './theme/markdown/cem';

// https://vitepress.dev/reference/site-config
export default async () => {
  let docsRoot = path.dirname(__dirname);

  let tree = await getDocsTree(docsRoot, '/');

  return defineConfigWithTheme<ThemeConfig>({
    title: "Rosella",
    description: "Themed Web Component UI library.",
    themeConfig: { tree },
    head: [['link', { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }]],
    cleanUrls: true,
    vite: {
      resolve: {
        alias: {
          '@rosella': path.resolve(__dirname, '../../src'),
          '@dist': path.resolve(__dirname, '../../dist'),
        },
      }
    },
    markdown: {
      config: (md) => {
        md.use(containersPlugin);
        md.use(cemPlugin);
      },
    },
    vue: {
      template: { compilerOptions: { isCustomElement: (tag) => tag.includes('-') } }
    },
  });
};

type ThemeConfig = {
  tree: DocsNode;
};

export type DocsNode = {
  data: { [key: string]: any; } | undefined;
  link: string;
  children?: DocsNode[];
}

// Walk a directory, but ignore entries that are prefixed with a dot.
async function getDocsTree(dir: string, link: string): Promise<DocsNode> {
  let data: { [key: string]: any; } | undefined;
  let children: DocsNode[] = [];

  for await (const d of await fs.promises.opendir(dir)) {
    if (d.name.startsWith('.')) continue;

    const entry = path.join(dir, d.name);

    if (d.isDirectory()) {
      children.push(await getDocsTree(entry, `${link}${link.endsWith('/') ? '' : '/'}${d.name}`));
    } else if (d.isFile() && d.name.endsWith('.md')) {
      let src = await fs.promises.readFile(entry, 'utf8');
      let frontmatter = matter(src);

      if (d.name === 'index.md') {
        data = frontmatter.data;
      } else {
        children.push({
          data: frontmatter.data,
          link: `${link}${link.endsWith('/') ? '' : '/'}${d.name.replace(/\.md$/, '')}`,
        });
      }
    }
  }

  return {
    data,
    link,
    ...(children.length > 0) && { children }
  };
}
