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
  const [color2, setColor2] = useState("#ec4899"); // Secondary (Pinkish)
  const [strokeWidth, setStrokeWidth] = useState(2); // Default thickness
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "gradient">("solid");

  // Drawing Constants
  const SCALE = 80;
  const OFFSET_X = 0;
  const OFFSET_Y = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Setup Data & Clear Canvas
    const currentLayoutData = getKeyboardLayout(layout, includeNumbers);
    const DRAW_OFFSET_Y = includeNumbers ? OFFSET_Y + 60 : OFFSET_Y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Keyboard Background (Keys)
    Object.keys(currentLayoutData).forEach((key) => {
      const pos = currentLayoutData[key];
      const x = pos.x * SCALE + OFFSET_X;
      const y = pos.y * SCALE + DRAW_OFFSET_Y;
      const isActive = text.toUpperCase().includes(key);

      const size = 36;
      ctx.beginPath();
      ctx.roundRect(x - size / 2, y - size / 2, size, size, 8);

      // Indigo glow for active keys, subtle white for inactive
      ctx.fillStyle = isActive
        ? "rgba(99, 102, 241, 0.2)"
        : "rgba(255, 255, 255, 0.03)";
      ctx.fill();

      // Key Labels
      ctx.font = "bold 12px Inter";
      ctx.textAlign = "center";
      ctx.fillStyle = isActive ? "#818cf8" : "#3f3f46";
      ctx.fillText(key, x, y + 5);
    });

    // 3. Prepare Signature Points
    const points = text
      .toUpperCase()
      .split("")
      .map((char) => currentLayoutData[char])
      .filter((p) => !!p);

    // 4. Draw Signature Path (Only if 2+ points exist)
    if (points.length >= 2) {
      const pixelPoints = points.map((p) => ({
        x: p.x * SCALE + OFFSET_X,
        y: p.y * SCALE + DRAW_OFFSET_Y,
      }));

      const pathData = generatePath(pixelPoints, curveType);
      const path = new Path2D(pathData);

      // Set Common Styles
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;

      // Handle Gradient vs Solid
      if (strokeStyle === "gradient") {
        const xCoords = pixelPoints.map((p) => p.x);
        const yCoords = pixelPoints.map((p) => p.y);

        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);

        // Create a diagonal gradient from the start of the word to the end
        // We add +1 to avoid division by zero errors on single letters
        const grad = ctx.createLinearGradient(minX, minY, maxX + 1, maxY + 1);

        grad.addColorStop(0, color); // Starts with Color 1
        grad.addColorStop(1, color2); // Ends with Color 2

        ctx.strokeStyle = grad;
        // ctx.shadowColor = color; // You can also blend shadow colors, but sticking to one is cleaner
      } else {
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
      }
      // Final Single Stroke
      ctx.stroke(path);

      // Reset Shadow so it doesn't affect other drawings
      ctx.shadowBlur = 0;
    }
  }, [
    text,
    layout,
    curveType,
    includeNumbers,
    color,
    color2,
    strokeWidth,
    strokeStyle,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-5xl w-full space-y-6">
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
          strokeStyle={strokeStyle}
          setStrokeStyle={setStrokeStyle}
          color2={color2}
          setColor2={setColor2}
        />

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
            placeholder="Enter your name..."
            className="w-full mt-10  border-b py-4 text-3xl text-center focus:outline-none focus:border-primary transition-all font-light tracking-widest"
          />
        </div>
      </div>
    </div>
  );
};

export default KeyboardSignature;
