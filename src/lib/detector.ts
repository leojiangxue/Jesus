import * as ort from 'onnxruntime-web';

let modelSession: ort.InferenceSession | null = null;
let isWarmingUp = false;

// Ensure WASM path is resolved correctly in Vite (Pinned to installed version 1.24.3)
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/';

export const initDetector = async () => {
  if (!modelSession) {
    // Try to mount via WebGL first for pure GPU hardware acceleration, fallback to WASM
    modelSession = await ort.InferenceSession.create('/model/yolov8n.onnx', { 
      executionProviders: ['webgl', 'wasm'] 
    });
    
    // Warm up the model using a dummy zero tensor to compile shaders (prevents freezing on first inference)
    if (!isWarmingUp) {
      isWarmingUp = true;
      try {
        const dummyTensor = new ort.Tensor('float32', new Float32Array(1 * 3 * 640 * 640), [1, 3, 640, 640]);
        await modelSession.run({ [modelSession.inputNames[0]]: dummyTensor });
      } catch (e) {
        console.warn("Warmup failed, but model is loaded:", e);
      }
    }
  }
  return modelSession;
};

export interface DetectionResult {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

const validClassesList = ['cell phone', 'laptop', 'tv', 'mouse', 'keyboard'];
const yoloCOCOClasses = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
  "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse",
  "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie",
  "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
  "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon",
  "bowl", "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut",
  "cake", "chair", "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse",
  "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book",
  "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
];

const iou = (box1: [number, number, number, number], box2: [number, number, number, number]) => {
  const [x1, y1, w1, h1] = box1;
  const [x2, y2, w2, h2] = box2;
  const interX = Math.max(x1, x2);
  const interY = Math.max(y1, y2);
  const interW = Math.min(x1 + w1, x2 + w2) - interX;
  const interH = Math.min(y1 + h1, y2 + h2) - interY;
  if (interW <= 0 || interH <= 0) return 0;
  const intersection = interW * interH;
  return intersection / (w1 * h1 + w2 * h2 - intersection);
};

export const detectDigitalItems = async (imageElement: HTMLImageElement): Promise<DetectionResult | null> => {
  const session = await initDetector();

  const width = 640;
  const height = 640;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Resize with padding to maintain aspect ratio
  const imgW = imageElement.width;
  const imgH = imageElement.height;
  const scale = Math.min(width / imgW, height / imgH);
  const newW = imgW * scale;
  const newH = imgH * scale;
  const padX = (width - newW) / 2;
  const padY = (height - newH) / 2;

  // Use (114, 114, 114) gray padding. Black padding creates hard mathematical edges that distracts CNNs
  ctx.fillStyle = "rgb(114, 114, 114)";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(imageElement, padX, padY, newW, newH);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // HWC to NCHW flat float32 array
  const float32Data = new Float32Array(3 * width * height);
  for (let i = 0; i < width * height; i++) {
    float32Data[i] = data[i * 4] / 255.0;                   // R
    float32Data[width * height + i] = data[i * 4 + 1] / 255.0;   // G
    float32Data[2 * width * height + i] = data[i * 4 + 2] / 255.0; // B
  }

  const tensor = new ort.Tensor('float32', float32Data, [1, 3, width, height]);
  const results = await session.run({ [session.inputNames[0]]: tensor });
  
  // YOLOv8 output: [1, 84, 8400]
  const output = results[session.outputNames[0]].data as Float32Array;
  
  const numClasses = 80;
  const numGridElements = 8400; // generally 8400 for 640x640 output in yolov8n

  let detections: DetectionResult[] = [];
  
  for (let i = 0; i < numGridElements; i++) {
    // Find max class score
    let maxScore = -1;
    let classId = -1;
    for (let c = 0; c < numClasses; c++) {
      const score = output[(4 + c) * numGridElements + i];
      if (score > maxScore) {
        maxScore = score;
        classId = c;
      }
    }

    if (maxScore > 0.25) { // Confidence threshold
      const className = yoloCOCOClasses[classId];
      if (validClassesList.includes(className)) {
        const xc_640 = output[0 * numGridElements + i];
        const yc_640 = output[1 * numGridElements + i];
        const w_640 = output[2 * numGridElements + i];
        const h_640 = output[3 * numGridElements + i];

        // Map back to original image dimensions
        let w = w_640 / scale;
        let h = h_640 / scale;
        const xc = (xc_640 - padX) / scale;
        const yc = (yc_640 - padY) / scale;
        
        let x = xc - w / 2;
        let y = yc - h / 2;

        // Clamp to image boundaries accurately
        x = Math.max(0, x);
        y = Math.max(0, y);
        w = Math.min(imgW - x, w);
        h = Math.min(imgH - y, h);

        detections.push({
          bbox: [x, y, w, h],
          class: className,
          score: maxScore
        });
      }
    }
  }

  // Non-Maximum Suppression (NMS)
  detections.sort((a, b) => b.score - a.score);
  const nmsDetections: DetectionResult[] = [];
  
  while (detections.length > 0) {
    const bestMatch = detections.shift()!;
    nmsDetections.push(bestMatch);
    detections = detections.filter(d => iou(bestMatch.bbox, d.bbox) < 0.45); // IoU threshold
  }

  if (nmsDetections.length > 0) {
    // Return the highest scoring valid digital item
    return nmsDetections[0];
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
