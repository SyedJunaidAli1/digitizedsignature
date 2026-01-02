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
  const OFFSET_X = 0;
  const OFFSET_Y = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. GET COLORS FROM YOUR GLOBAL.CSS
    const rootStyle = getComputedStyle(document.documentElement);
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

    // 2. GEOMETRY (Using your refined UI values)
    const KEY_SIZE = 56;
    const RADIUS = 8;
    const SPACING = 62;

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
        // THE "HIT" STATE: Transition feel
        ctx.fillStyle = colors.accent;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
      } else if (isActive) {
        // PART OF THE SIGNATURE: Active but not the current "hit"
        ctx.fillStyle = colors.background;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
      } else {
        // DEFAULT STATE
        ctx.fillStyle = colors.background;
        ctx.globalAlpha = 0.4; // Subtle inactive look
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
      }

      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.stroke();

      // DRAW LABELS: Centered as per your photo
      ctx.font = "600 16px var(--font-sans)";
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

      // Signature glow
      ctx.shadowBlur = 2;
      ctx.shadowColor = color;

      if (strokeStyle === "gradient") {
        // FIX: Calculate the bounding box of the whole path
        const xCoords = pixelPoints.map((p) => p.x);
        const yCoords = pixelPoints.map((p) => p.y);

        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);

        /**
         * BUG FIX: If you start and end on the same key, maxX === minX.
         * A 0-length gradient is invisible. We add a 1px buffer to force visibility.
         */
        const grad = ctx.createLinearGradient(
          minX,
          minY,
          maxX === minX ? maxX + 1 : maxX,
          maxY === minY ? maxY + 1 : maxY,
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
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your name"
          className="border-b text-2xl mt-2 text-center text-primary focus:outline-none focus:border-primary transition-all font-light tracking-widest"
        />
        <canvas ref={canvasRef} width={680} height={300} />
      </div>
    </div>
  );
};

export default KeyboardSignature;
