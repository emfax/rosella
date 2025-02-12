import { onMounted, onUnmounted, onUpdated, Ref } from "vue";
import { throttleAndDebounce } from "../support/utils";
import { getScrollOffset } from "vitepress";

export type MenuItem = {
  element: HTMLHeadElement;
  level: number;
  link: string;
  title: string;
  children?: MenuItem[];
}

const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/;

// cached list of anchor elements from resolveHeaders
const resolvedHeaders: { element: HTMLHeadElement; link: string }[] = []

function serializeHeader(h: Element): string {
  let ret = ''
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (ignoreRE.test((node as Element).className)) continue
      ret += node.textContent
    } else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  return ret.trim()
}

function buildTree(data: MenuItem[], min: number, max: number): MenuItem[] {
  // resolvedHeaders.length = 0

  const result: MenuItem[] = []
  const stack: (MenuItem | { level: number; shouldIgnore: true })[] = []

  data.forEach((item) => {
    const node = { ...item, children: [] }
    let parent = stack[stack.length - 1]

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    if (
      node.element.classList.contains('ignore-header') ||
      (parent && 'shouldIgnore' in parent)
    ) {
      stack.push({ level: node.level, shouldIgnore: true })
      return
    }

    if (node.level > max || node.level < min) return
    resolvedHeaders.push({ element: node.element, link: node.link })

    if (parent) parent.children!.push(node)
    else result.push(node)

    stack.push(node)
  })

  return result
}

function resolveHeaders(
  headers: MenuItem[],
  // range?: DefaultTheme.Config['outline']
): MenuItem[] {
  // if (range === false) {
  //   return []
  // }

  // const levelsRange =
  //   (typeof range === 'object' && !Array.isArray(range)
  //     ? range.level
  //     : range) || 2

  // const [high, low]: [number, number] =
  //   typeof levelsRange === 'number'
  //     ? [levelsRange, levelsRange]
  //     : levelsRange === 'deep'
  //       ? [2, 6]
  //       : levelsRange

  return buildTree(headers, 2, 3)
}

export function getHeaders(): MenuItem[] {
  const headers = [
    ...document.querySelectorAll('.doc :where(h1,h2,h3,h4,h5,h6)')
  ]
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: '#' + el.id,
        level
      }
    })

  return resolveHeaders(headers)
}

function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0
  while (element !== document.body) {
    if (element === null) {
      // child element is:
      // - not attached to the DOM (display: none)
      // - set to fixed position (not scrollable)
      // - body or html element (null offsetParent)
      return NaN
    }
    offsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return offsetTop
}

export function useActiveAnchor(
  container: Ref<HTMLElement>,
  marker: Ref<HTMLElement>
): void {
  // const { isAsideEnabled } = useAside()

  const onScroll = throttleAndDebounce(setActiveLink, 200)

  let prevActiveLink: HTMLAnchorElement | null = null

  onMounted(() => {
    requestAnimationFrame(setActiveLink)
    window.addEventListener('scroll', onScroll)
  })

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  function setActiveLink() {
    // if (!isAsideEnabled.value) {
    //   return
    // }

    const scrollY = window.scrollY
    const innerHeight = window.innerHeight
    const offsetHeight = document.body.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) <= 1

    // resolvedHeaders may be repositioned, hidden or fix positioned
    const headers = resolvedHeaders
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element)
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top);

    // no headers available for active link
    if (!headers.length) {
      activateLink(null)
      return
    }

    // page top
    if (scrollY < 1) {
      activateLink(null)
      return
    }

    // page bottom - highlight last link
    if (isBottom) {
      activateLink(headers[headers.length - 1].link)
      return
    }

    // find the last header above the top of viewport
    let activeLink: string | null = null
    for (const { link, top } of headers) {
      if (top > scrollY + getScrollOffset() + 4) {
        break
      }
      activeLink = link
    }
    activateLink(activeLink)
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove('font-medium', 'text-primary-500')
    }

    if (hash == null) {
      prevActiveLink = null
    } else {
      prevActiveLink = container.value.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`
      )
    }

    const activeLink = prevActiveLink

    if (activeLink) {
      activeLink.classList.add('font-medium', 'text-primary-500')
      marker.value.style.top = activeLink.offsetTop + 39 + 'px'
      marker.value.style.opacity = '1'
    } else {
      marker.value.style.top = '33px'
      marker.value.style.opacity = '0'
    }
  }
}