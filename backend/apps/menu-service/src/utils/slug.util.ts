import * as slugify from 'slugify';

export function generateSlug(str: string) {
  return slugify.default(str, {
    lower: true,
    strict: true,
    locale: 'vi',
  });
}
