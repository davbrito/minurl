import { nanoid } from "nanoid";

export function getSlugToUrlKey(slug: string) {
  return `slug:${slug}`;
}

export function getMinifiedPath(id: string) {
  return `/x/${id}`;
}

export function getPreviewPath(id: string) {
  return `/minified/${id}`;
}

const MIN_ID_LENGTH = 5;

export function generateSlug(url: string) {
  const initials = url
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .split(/[^a-zA-Z0-9]/)
    .slice(0, 5)
    .map((part) => part.charAt(0));

  const prefix = sample(initials, Math.max(3, initials.length))
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const suffixLength = Math.max(MIN_ID_LENGTH - initials.length, 5);

  const suffix = nanoid(suffixLength);

  return `${prefix}-${suffix}`;
}

function sample<T>(array: ArrayLike<T>, size: number): T[] {
  const result: T[] = [];
  const taken = new Set<number>();
  const n = array.length;

  size = Math.min(size, n);

  const replace = size > n;

  while (result.length < size) {
    const index = Math.floor(Math.random() * n);
    if (!taken.has(index) || replace) {
      taken.add(index);
      result.push(array[index]);
    }
  }

  return result;
}
