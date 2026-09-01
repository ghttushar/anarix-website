import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

const ASPECTS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function getCroppedBlob(src: string, area: Area): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/jpeg",
      0.92,
    );
  });
}

/** Always crops from the untouched original — never destructive, never compounds quality loss on re-crop. */
export function CropModal({
  originalSrc,
  onCancel,
  onApply,
}: {
  originalSrc: string;
  onCancel: () => void;
  onApply: (blob: Blob) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback(
    (_area: Area, areaPixels: Area) => setCroppedAreaPixels(areaPixels),
    [],
  );

  async function handleApply() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    try {
      const blob = await getCroppedBlob(originalSrc, croppedAreaPixels);
      onApply(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: 720 }}>
        <div className="admin-modal__header">
          <h2>Crop image</h2>
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--icon"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <div className="admin-modal__body">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 380,
              background: "#111",
              borderRadius: 8,
            }}
          >
            <Cropper
              image={originalSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect ?? undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {ASPECTS.map((a) => (
              <button
                key={a.label}
                type="button"
                className={`admin-btn admin-btn--sm ${aspect === a.value ? "admin-btn--primary" : ""}`}
                onClick={() => setAspect(a.value)}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="admin-field" style={{ marginTop: "1rem" }}>
            <label className="admin-label">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="admin-modal__footer">
          <button type="button" className="admin-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleApply}
            disabled={busy || !croppedAreaPixels}
          >
            {busy ? "Applying…" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
