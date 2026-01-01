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

    // 1. GET COLORS FROM YOUR GLOBAL.CSS
    const rootStyle = getComputedStyle(document.documentElement);

    // Helper to get variable values
    const getVar = (name: string) => rootStyle.getPropertyValue(name).trim();

    const colors = {
      background: getVar("--background"),
      foreground: getVar("--foreground"),
      muted: getVar("--muted"),
      mutedForeground: getVar("--muted-foreground"),
      border: getVar("--border"),
      accent: getVar("--accent"),
    };

    const currentLayoutData = getKeyboardLayout(layout, includeNumbers);
    const DRAW_OFFSET_Y = includeNumbers ? OFFSET_Y + 70 : OFFSET_Y;

    // 2. GEOMETRY (Matching your "spacious" photo)
    const KEY_SIZE = 56;
    const RADIUS = 12;
    const SPACING = 62; // Large gaps between keys

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. DRAW KEYS
    Object.keys(currentLayoutData).forEach((key) => {
      const pos = currentLayoutData[key];
      const x = pos.x * SPACING + OFFSET_X;
      const y = pos.y * SPACING + DRAW_OFFSET_Y;

      const isActive = text.toUpperCase().includes(key);
      const isLatest = text.toUpperCase().endsWith(key);

      ctx.beginPath();
      ctx.roundRect(
        x - KEY_SIZE / 2,
        y - KEY_SIZE / 2,
        KEY_SIZE,
        KEY_SIZE,
        RADIUS,
      );

      if (isLatest) {
        // THE "HIT" STATE (When you type it)
        ctx.fillStyle = colors.accent;
        ctx.strokeStyle = color; // Your selected signature color
        ctx.lineWidth = 2;
      } else if (isActive) {
        // PART OF THE SIGNATURE
        ctx.fillStyle = colors.background;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
      } else {
        // DEFAULT STATE
        ctx.fillStyle = colors.background;
        ctx.globalAlpha = 0.4; // Make inactive keys slightly more subtle
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
      }

      ctx.fill();
      ctx.globalAlpha = 1.0; // Reset alpha
      ctx.stroke();

      // DRAW LABELS (Centered exactly like your photo)
      ctx.font = "600 16px var(--font-sans)"; // Uses your Geist Sans font
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = isActive ? colors.foreground : colors.mutedForeground;

      ctx.fillText(key, x, y);
    });

    // 4. DRAW SIGNATURE PATH
    const points = text
      .toUpperCase()
      .split("")
      .map((char) => currentLayoutData[char])
      .filter((p) => !!p);

    if (points.length >= 2) {
      const pixelPoints = points.map((p) => ({
        x: p.x * SPACING + OFFSET_X,
        y: p.y * SPACING + DRAW_OFFSET_Y,
      }));

      const pathData = generatePath(pixelPoints, curveType);
      const path = new Path2D(pathData);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = strokeWidth;

      // Add signature glow
      ctx.shadowBlur = 18;
      ctx.shadowColor = color;

      if (strokeStyle === "gradient") {
        const grad = ctx.createLinearGradient(
          pixelPoints[0].x,
          pixelPoints[0].y,
          pixelPoints[pixelPoints.length - 1].x,
          pixelPoints[pixelPoints.length - 1].y,
        );
        grad.addColorStop(0, color);
        grad.addColorStop(1, color2);
        ctx.strokeStyle = grad;
      } else {
        ctx.strokeStyle = color;
      }

      ctx.stroke(path);
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
      <div className="flex flex-col items-center justify-center w-auto">
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
        <canvas
          ref={canvasRef}
          width={620}
          height={300}
          className="w-auto h-auto"
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your name"
          className="border-b text-2xl text-center text-primary focus:outline-none focus:border-primary transition-all font-light tracking-widest"
        />
      </div>
    </div>
  );
};

export default KeyboardSignature;
