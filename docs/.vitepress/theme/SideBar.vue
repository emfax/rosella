<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import type { DocsNode } from "../config";
import { toDisplayString } from 'vue';

const { theme } = useData();
const route = useRoute();

const docs = theme.value.tree;

const condition = (el: DocsNode) => Array.isArray(el.children) && el.children.length > 0;
const sortNodes = (a: DocsNode, b: DocsNode) => {
    if (a.data?.hasOwnProperty('order') && b.data?.hasOwnProperty('order')) {
        return a.data.order - b.data.order;
    }

    if (a.data?.hasOwnProperty('order') && !b.data?.hasOwnProperty('order')) {
        return -1;
    }

    if (!a.data?.hasOwnProperty('order') && b.data?.hasOwnProperty('order')) {
        return 1;
    }

    if (a.data?.title < b.data?.title) {
        return -1;
    }

    if (a.data?.title > b.data?.title) {
        return 1;
    }

    return 0;
};

const groups = docs.children.filter(condition);
const topLevelLeaves = docs.children.filter((el: DocsNode) => !condition(el));

topLevelLeaves.sort(sortNodes);
groups.sort(sortNodes);

let sideBar = [{ ...docs, children: topLevelLeaves }];

sideBar = sideBar.concat(groups);
</script>

<template>
    <nav>
        <ul class="space-y-9">
            <li v-for="group in sideBar">
                <a :href="group.link">
                    <h2 class="text-sm font-medium text-slate-900 dark:text-white">{{ group.data.title }}</h2>
                </a>
                <ul class="text-sm mt-2 space-y-2 lg:mt-4 lg:space-y-4">
                    <li v-for="child in group.children"
                        :class="['block w-full pl-3', route.path === child.link ? 'font-semibold text-sky-500' : 'text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300']">
                        <a :href="child.link">{{ child.data.title }}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>