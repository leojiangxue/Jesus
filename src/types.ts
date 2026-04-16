export interface Defect {
  type: "划痕" | "磕碰" | "磨损" | "裂痕" | "碎裂" | "掉漆" | "其他";
  location: string;
  severity: "轻微" | "明显" | "严重";
}

export interface BoundingBox {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  type: "item" | "defect";
}

export interface RecognitionResult {
  id: string;
  visual_analysis?: string; // Added to force Chain of Thought
  category: string;
  brand: string;
  model: string;
  defects: Defect[];
  boxes: BoundingBox[];
  confidence: number;
  inferenceTime: number;
  timestamp: string;
  imageUrl: string;
  imageUrls?: string[]; // Added for comprehensive recognition
  status: 'success' | 'error';
  estimatedPrice?: {
    min: number;
    max: number;
    currency: string;
    reasoning: string;
  };
}
