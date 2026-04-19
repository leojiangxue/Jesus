const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'model');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadModel() {
  try {
    const response = await fetch('https://github.com/Hyuto/yolov8-onnxruntime-web/raw/master/public/model/yolov8n.onnx');
    if (!response.ok) throw new Error("Status " + response.status);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(path.join(dir, 'yolov8n.onnx'), buffer);
    console.log('Model downloaded, size: ' + buffer.length);
  } catch(e) {
    console.error('Error:', e);
  }
}
downloadModel();
