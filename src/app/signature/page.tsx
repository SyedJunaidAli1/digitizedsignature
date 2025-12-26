"use client";
import { useState, useEffect, useRef } from "react";
import {
  KeyboardLayout,
  keyboardLayouts,
  generatePath,
  CurveType,
} from "@/src/lib/util/constant";
import Options from "../components/Options";

const KeyboardSignature = () => {
  const [text, setText] = useState("");
  const [layout, setLayout] = useState<KeyboardLayout>(KeyboardLayout.QWERTY);
  const [curveType, setCurveType] = useState<CurveType>("linear");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing Constants
  const SCALE = 80;
  const OFFSET_X = 0;
  const OFFSET_Y = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Optional: Merge numberRow if you want to show 1,2,3...
    const currentLayoutData = keyboardLayouts[layout];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Keyboard Background (Curved Squares)
    Object.keys(currentLayoutData).forEach((key) => {
      const pos = currentLayoutData[key];
      const x = pos.x * SCALE + OFFSET_X;
      const y = pos.y * SCALE + OFFSET_Y;
      const isActive = text.toUpperCase().includes(key);

      const size = 40; // The width/height of the key
      const radius = 10; // The "curvature" of the square

      ctx.beginPath();
      // We center the square by subtracting half the size from X and Y
      ctx.roundRect(x - size / 2, y - size / 2, size, size, radius);

      ctx.fillStyle = isActive
        ? "rgba(99, 102, 241, 0.2)"
        : "rgba(255, 255, 255, 0.03)";
      ctx.fill();

      // Add a subtle border to the keycap
      ctx.strokeStyle = isActive
        ? "rgba(99, 102, 241, 0.5)"
        : "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw the Letter Label
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = isActive ? "#818cf8" : "#6941d9";
      ctx.fillText(key, x, y);
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
        y: p.y * SCALE + OFFSET_Y,
      }));

      const pathData = generatePath(pixelPoints, curveType);
      const path = new Path2D(pathData);

      // Line Styling
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#6366f1";
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke(path);

      // Reset shadow so it doesn't affect future draws
      ctx.shadowBlur = 0;
    }
  }, [text, layout, curveType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-5xl w-full space-y-6">
        <div>
          <Options
            layout={layout}
            setLayout={setLayout}
            curveType={curveType}
            setCurveType={setCurveType}
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
            className="w-full mt-10  border-b py-4 text-3xl text-center focus:outline-none focus:border-indigo-500 transition-all font-light tracking-widest"
          />
        </div>
      </div>
    </div>
  );
};

export default KeyboardSignature;
