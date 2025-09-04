import { GenerateCardOptions, FilterSettings } from '../types';

async function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src instanceof File || src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.crossOrigin = 'anonymous';
      img.src = src;
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  sepia: 0,
};

export async function generateCard({
  userFile,
  templateUrl,
  scale = 1,
  filters = DEFAULT_FILTERS,
}: GenerateCardOptions) {
  const base = 1080;
  const size = base * scale;

  const [userImg, templateImg] = await Promise.all([
    loadImage(userFile),
    loadImage(templateUrl),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.filter = `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    grayscale(${filters.grayscale}%)
    sepia(${filters.sepia}%)
  `;

  const srcW = userImg.width;
  const srcH = userImg.height;
  const fitScale = Math.max(size / srcW, size / srcH);
  const drawW = srcW * fitScale;
  const drawH = srcH * fitScale;
  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;

  ctx.drawImage(userImg, 0, 0, srcW, srcH, dx, dy, drawW, drawH);
  ctx.filter = 'none';

  ctx.drawImage(
    templateImg,
    0,
    0,
    templateImg.width,
    templateImg.height,
    0,
    0,
    size,
    size,
  );

  if (userFile instanceof File) URL.revokeObjectURL(userImg.src);

  return canvas.toDataURL('image/png');
}
