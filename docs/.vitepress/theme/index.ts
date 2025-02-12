// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue';
import type { Theme } from 'vitepress';
import './style.css';
import '@rosella';
import '@rosella/index.css';
import 'vitepress/dist/client/theme-default/styles/components/vp-doc.css';
import HtmlPreview from './HtmlPreview.vue';

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('HtmlPreview', HtmlPreview);
  }
} satisfies Theme

