/** A photo's natural width and height, so the public page can reserve its space (L2-REQ-095 AC4). */
export function measurePhoto(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const image = new Image();
    const fallback = { width: 1200, height: 900 };
    image.onload = () =>
      resolve(
        image.naturalWidth > 0 && image.naturalHeight > 0
          ? {
              width: Math.min(image.naturalWidth, 10000),
              height: Math.min(image.naturalHeight, 10000),
            }
          : fallback,
      );
    image.onerror = () => resolve(fallback);
    image.src = src;
  });
}
