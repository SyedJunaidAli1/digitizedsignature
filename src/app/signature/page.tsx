"use client";
import { useState, useEffect, useRef } from "react";
import {
  KeyboardLayout,
  generatePath,
  CurveType,
  getKeyboardLayout,
} from "@/lib/util/constant";
import Options from "@/app/components/Options";

const KeyboardSignature = () => {
  const [text, setText] = useState("");
  const [layout, setLayout] = useState<KeyboardLayout>(KeyboardLayout.QWERTY);
  const [curveType, setCurveType] = useState<CurveType>("linear");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [color, setColor] = useState("#FFFFFF"); // Default white
  const [strokeWidth, setStrokeWidth] = useState(3); // Default thickness

  // Drawing Constants
  const SCALE = 80;
  const OFFSET_X = 0;
  const OFFSET_Y = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // This merges numberRow + keyboardLayouts[layout]
    const currentLayoutData = getKeyboardLayout(layout, includeNumbers);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // we need to push everything down so the numbers aren't cut off at the top.
    const DRAW_OFFSET_Y = includeNumbers ? OFFSET_Y + 60 : OFFSET_Y;

    // 1. Draw Keyboard Background (Keys)
    Object.keys(currentLayoutData).forEach((key) => {
      const pos = currentLayoutData[key];
      const x = pos.x * SCALE + OFFSET_X;
      const y = pos.y * SCALE + DRAW_OFFSET_Y; // Use the adjusted offset
      const isActive = text.toUpperCase().includes(key);

      // Draw your Curved Squares (Keycaps)
      const size = 36;
      ctx.beginPath();
      ctx.roundRect(x - size / 2, y - size / 2, size, size, 8);
      ctx.fillStyle = isActive
        ? "rgba(99, 102, 241, 0.2)"
        : "rgba(255, 255, 255, 0.03)";
      ctx.fill();

      // Draw the Label
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      ctx.fillStyle = isActive ? "#818cf8" : "#3f3f46";
      ctx.fillText(key, x, y + 5);
    });

    // 2. Draw Signature Path
    const points = text
      .toUpperCase()
      .split("")
      .map((char) => currentLayoutData[char])
      .filter((p) => !!p);

    if (points.length >= 2) {
      const pixelPoints = points.map((p) => ({
        x: p.x * SCALE + OFFSET_X,
        y: p.y * SCALE + DRAW_OFFSET_Y, // Use the same adjusted offset
      }));

      const pathData = generatePath(pixelPoints, curveType);
      const path = new Path2D(pathData);

      // Apply the styles from state
      ctx.shadowBlur = 8;
      ctx.shadowColor = color; // Glow matches the line color
      ctx.strokeStyle = color; // Line matches the picker
      ctx.lineWidth = strokeWidth; // Width matches the slider
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.stroke(path);
      ctx.shadowBlur = 0;
    }
  }, [text, layout, curveType, includeNumbers, color, strokeWidth]); // includeNumbers MUST be here

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-5xl w-full space-y-6">
        <div>
          <Options
            layout={layout}
            setLayout={setLayout}
            curveType={curveType}
            setCurveType={setCurveType}
            includeNumbers={includeNumbers}
            setIncludeNumbers={setIncludeNumbers}
            color={color}
            setColor={setColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
          />
        </div>

        <div className="border rounded-3xl px-2 py-8 backdrop-blur-md">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-auto"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your signature..."
            className="w-full mt-10  border-b py-4 text-3xl text-center focus:outline-none focus:border-primary transition-all font-light tracking-widest"
          />
        </div>
      </div>
    </div>
  );
};

export default KeyboardSignature;
