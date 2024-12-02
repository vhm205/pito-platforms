export * from './role-type';
export * from './order';

export const IMAGE_BASE_URLS = Object.freeze({
  item: process.env.STORAGE_URL
    ? process.env.STORAGE_URL.concat('/v1/render/image/public/images/product/')
    : '',
});
