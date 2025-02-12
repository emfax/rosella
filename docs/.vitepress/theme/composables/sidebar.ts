import { useData } from 'vitepress';
import { computed } from 'vue';

export function useSideBar() {
  const { frontmatter } = useData();

  const hasAside = computed(() => {
    if (frontmatter.value.layout === 'home') return false;

    if (frontmatter.value.aside != null) return !!frontmatter.value.aside;

    return false;
  });

  return { hasAside };
}