<script setup lang="ts">
import type { MenuItem } from '../composables/outline'

defineProps<{
    headers: MenuItem[]
    root?: boolean
}>()

function onClick({ target: el }: Event) {
    const id = (el as HTMLAnchorElement).href!.split('#')[1]
    const heading = document.getElementById(decodeURIComponent(id))
    heading?.focus({ preventScroll: true })
}
</script>

<template>
    <ul class="space-y-xs" :class="{ 'ml-sm': !root }">
        <li v-for="{ children, link, title } in headers" class="space-y-xs">
            <a class="text-sm text-base-600" :href="link" @click="onClick" :title="title">{{ title }}</a>
            <template v-if="children?.length">
                <DocOutlineItem :headers="children" />
            </template>
        </li>
    </ul>
</template>