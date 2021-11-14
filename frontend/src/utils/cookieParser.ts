export const cookieParser = (name: string): string | undefined => {
  const matches = new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
  ).exec(document.cookie);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};
