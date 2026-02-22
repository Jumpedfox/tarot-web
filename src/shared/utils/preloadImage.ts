export const preloadImage = (url: string): Promise<void> =>
  new Promise((resolve) => {
    if (!url) return resolve();
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
