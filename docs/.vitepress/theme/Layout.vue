<script setup lang="ts">
import { useData } from 'vitepress';
import Header from './Header.vue';
import SideBar from './SideBar.vue';
import Prose from './Prose.vue';
import DocAside from './components/DocAside.vue';
import { useSideBar } from './composables/sidebar';

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()

const { hasAside } = useSideBar();
</script>

<template>
  <div className="flex w-full flex-col">
    <Header />
    <div class="relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
      <div class="hidden lg:relative lg:block lg:flex-none">
        <div class="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
        <div class="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
        <div class="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
        <div
          class="sticky top-[4.75rem] -ml-0.5 h-[calc(100vh-4.75rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
          <SideBar />
        </div>
      </div>
      <div v-if="frontmatter.home"
        class="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <h1>{{ site.title }}</h1>
        <p>{{ site.description }}</p>
      </div>
      <div v-else class="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <Prose>
          <Content />
        </Prose>
      </div>
      <div v-if="hasAside" class="aside">
        <div class="aside-container">
          <DocAside />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.aside {
  position: relative;
  min-width: 16rem;
}

.aside-container {
  position: fixed;
}
</style>
