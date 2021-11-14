export const popupWindowCenter = (
  url: string,
  title: string,
  w: number,
  h: number
): Window | null => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const height =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;

  const left = (width - w) / 2 + dualScreenLeft;
  const top = (height - h) / 2 + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
  );

  return newWindow;
};
