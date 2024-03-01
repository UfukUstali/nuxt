import type { RendererNode } from "vue";

/**
 * Retrieve the HTML content from an element
 * Handles `<!--[-->` Fragment elements
 * @param element the element to retrieve the HTML
 * @param withoutSlots purge all slots from the HTML string retrieved
 * @returns {string[]} An array of string which represent the content of each element. Use `.join('')` to retrieve a component vnode.el HTML
 */
export function getFragmentHTML(
  element: RendererNode | null,
  withoutSlots = false,
): string[] | null {
  if (element) {
    if (element.nodeName === "#comment" && element.nodeValue === "[") {
      return getFragmentChildren(element, [], withoutSlots);
    }
    if (withoutSlots) {
      const clone = element.cloneNode(true);
      clone.querySelectorAll("[data-island-slot]").forEach((n: Element) => {
        n.innerHTML = "";
      });
      return [clone.outerHTML];
    }
    return [element.outerHTML];
  }
  return null;
}

function getFragmentChildren(
  element: RendererNode | null,
  blocks: string[] = [],
  withoutSlots = false,
) {
  if (element && element.nodeName) {
    if (isEndFragment(element)) {
      return blocks;
    } else if (!isStartFragment(element)) {
      const clone = element.cloneNode(true) as Element;
      if (withoutSlots) {
        clone.querySelectorAll("[data-island-slot]").forEach((n) => {
          n.innerHTML = "";
        });
      }
      blocks.push(clone.outerHTML);
    }

    getFragmentChildren(element.nextSibling, blocks, withoutSlots);
  }
  return blocks;
}

function isStartFragment(element: RendererNode) {
  return element.nodeName === "#comment" && element.nodeValue === "[";
}

function isEndFragment(element: RendererNode) {
  return element.nodeName === "#comment" && element.nodeValue === "]";
}
