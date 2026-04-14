export interface Defect {
  type: "划痕" | "磕碰" | "磨损";
  location: string;
  severity: "轻微" | "明显";
}

export interface BoundingBox {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  type: "item" | "defect";
}

export interface RecognitionResult {
  id: string;
  category: string;
  brand: string;
  model: string;
  defects: Defect[];
  boxes: BoundingBox[];
  confidence: number;
  inferenceTime: number;
  timestamp: string;
  imageUrl: string;
  status: 'success' | 'error';
  estimatedPrice?: {
    min: number;
    max: number;
    currency: string;
    reasoning: string;
  };
}
