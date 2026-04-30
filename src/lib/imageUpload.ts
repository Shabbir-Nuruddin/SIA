// Helpers for converting an uploaded image File into a base64 data URI
// the AI gateway (Gemini multimodal) can ingest directly via image_url.

const MAX_SIDE = 1600;
const MAX_BYTES = 4 * 1024 * 1024; // 4MB cap before resize

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file (PNG, JPG, HEIC, etc.)");
  }
  // Read into image
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Couldn't read image"));
      i.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    // Try descending quality until under cap
    for (const q of [0.85, 0.7, 0.55, 0.4]) {
      const data = canvas.toDataURL("image/jpeg", q);
      // approximate size (base64 → bytes)
      const bytes = Math.ceil((data.length - "data:image/jpeg;base64,".length) * 3 / 4);
      if (bytes <= MAX_BYTES) return data;
    }
    return canvas.toDataURL("image/jpeg", 0.4);
  } finally {
    URL.revokeObjectURL(url);
  }
}
