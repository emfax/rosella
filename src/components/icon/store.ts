const DB = openIconsDatabase();

const iconCache = new Map<string, SVGElement>();

/**
 * Retrieves an SVG element source from the database or downloads it from the given 'src'.
 * @param src The source URL of the SVG.
 * @returns A promise that resolves to the SVG element.
 */
export async function resolveIcon(src: string): Promise<SVGElement> {
  if (iconCache.has(src)) {
    console.log('cache hit');
    return iconCache.get(src)!.cloneNode(true) as SVGElement;
  }

  const db = await DB;

  return new Promise((resolve, reject) => {
    const tx = db.transaction('icon', 'readwrite');
    const store = tx.objectStore('icon');
    const request = store.get(src);

    request.onsuccess = async () => {
      if (request.result) {
        let svg = parseSvgElement(request.result.data);

        iconCache.set(src, svg);

        resolve(svg);
      } else {
        try {
          const response = await fetch(src);

          if (!response.ok) {
            throw new Error(`Failed to fetch SVG from ${src}`);
          }
          const data = await response.text();

          const tx = db.transaction('icon', 'readwrite');
          const store = tx.objectStore('icon');

          store.put({ src, data });

          let svg = parseSvgElement(data);

          iconCache.set(src, svg);

          resolve(svg);
        } catch (error) {
          reject(error);
        }
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Opens an IndexedDB database called 'icons' and returns a promise that resolves to the database.
 * @returns A promise that resolves to the IndexedDB database.
 */
function openIconsDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('icons', 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('icon')) {
        db.createObjectStore('icon', { keyPath: 'src' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Parses an SVGElement from a string.
 * @param svgString The string containing the SVG markup.
 * @returns The parsed SVGElement.
 */
export function parseSvgElement(svgString: string): SVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const svg = doc.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg").item(0);

  return svg as SVGElement;
}
