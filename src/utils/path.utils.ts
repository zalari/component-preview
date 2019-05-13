import {Pathname} from 'history';

export const PATH_SEPARATOR = '/';

export function sanitizePathname(pathname: string): string {
  return pathname.replace(new RegExp(`^\\${PATH_SEPARATOR}`), '');
}

export function getSlugsFromPathname(pathname: Pathname): string[] {
  return sanitizePathname(pathname).split(PATH_SEPARATOR);
}

export function getTagNameFromPathname(pathname: Pathname): string | undefined {
  const slugs = getSlugsFromPathname(pathname);
  if (slugs.length > 0) {
    return slugs[0];
  }
}

export function getSlugFromPathname(pathname: Pathname): string | undefined {
  const slugs = getSlugsFromPathname(pathname);
  if (slugs.length > 1) {
    return slugs[1];
  }
}