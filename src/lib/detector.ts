import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let model: cocoSsd.ObjectDetection | null = null;

export const initDetector = async () => {
  if (!model) {
    await tf.ready();
    model = await cocoSsd.load();
  }
  return model;
};

export interface DetectionResult {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

export const detectDigitalItems = async (imageElement: HTMLImageElement): Promise<DetectionResult | null> => {
  const net = await initDetector();
  const predictions = await net.detect(imageElement);
  
  // Filter for digital items
  const validClasses = ['cell phone', 'laptop', 'tv', 'mouse', 'keyboard'];
  const digitalItems = predictions.filter(p => validClasses.includes(p.class));
  
  if (digitalItems.length > 0) {
    // Return the one with highest confidence
    return digitalItems.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  }
  return null;
};

export const getCropInfo = (image: HTMLImageElement, bbox: [number, number, number, number]) => {
  const [x, y, width, height] = bbox;
  const paddingX = width * 0.05;
  const paddingY = height * 0.05;
  
  const sx = Math.max(0, x - paddingX);
  const sy = Math.max(0, y - paddingY);
  const sw = Math.min(image.width - sx, width + paddingX * 2);
  const sh = Math.min(image.height - sy, height + paddingY * 2);
  
  return { sx, sy, sw, sh };
};

export const cropImage = (image: HTMLImageElement, bbox: [number, number, number, number]): string => {
  const canvas = document.createElement('canvas');
  const { sx, sy, sw, sh } = getCropInfo(image, bbox);

  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
  
  return canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
};
