<script lang="ts" setup>
import { onContentUpdated } from "vitepress";
import { getHeaders, MenuItem, useActiveAnchor } from "../composables/outline";
import DocOutlineItem from "./DocOutlineItem.vue";
import { ref, shallowRef } from "vue";

const headers = shallowRef<MenuItem[]>([])

onContentUpdated(() => {
    headers.value = getHeaders();
});

const container = ref()
const marker = ref()

useActiveAnchor(container, marker);
</script>

<template>
    <aside>
        <nav ref="container">
            <div ref="marker"></div>
            <DocOutlineItem :headers="headers" :root="true" />
        </nav>
    </aside>
</template>