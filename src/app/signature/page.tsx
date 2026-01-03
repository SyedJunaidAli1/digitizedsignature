"use client";
import { useState, useEffect, useRef } from "react";
import {
  KeyboardLayout,
  generatePath,
  CurveType,
  getKeyboardLayout,
} from "@/lib/util/constant";
import Options from "@/app/components/Options";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";

const KeyboardSignature = () => {
  const [text, setText] = useState("");
  const [layout, setLayout] = useState<KeyboardLayout>(KeyboardLayout.QWERTY);
  const [curveType, setCurveType] = useState<CurveType>("linear");
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [color2, setColor2] = useState("#ec4899");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "gradient">("solid");

  // Animation States
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Canvas Refs
  const keyboardCanvasRef = useRef<HTMLCanvasElement>(null);
  const pathCanvasRef = useRef<HTMLCanvasElement>(null);

  // SHARED GEOMETRY - Keep these synced for perfect alignment
  const OFFSET_X = 260;
  const OFFSET_Y = 40;
  const KEY_SIZE = 56;
  const RADIUS = 8;
  const SPACING = 62;

  // 1. TYPING LOGIC: Trigger fade only after typing begins
  useEffect(() => {
    if (text.length > 0) {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2500); // Fades out after 2.5s of silence
    } else {
      // If text is cleared, bring keyboard back
      setIsTyping(false);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [text]);

  // 2. DRAW KEYBOARD LAYER (Static Keys + Hit States)
  useEffect(() => {
    const canvas = keyboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const colors = {
      primary: rootStyle.getPropertyValue("--primary").trim(),
      secondary: rootStyle.getPropertyValue("--secondary").trim(),
      background: rootStyle.getPropertyValue("--background").trim(),
      border: rootStyle.getPropertyValue("--border").trim(),
      mutedForeground: rootStyle.getPropertyValue("--muted-foreground").trim(),
      foreground: rootStyle.getPropertyValue("--foreground").trim(),
      accent: rootStyle.getPropertyValue("--accent").trim(),
    };

    const currentLayoutData = getKeyboardLayout(layout, includeNumbers);
    const DRAW_OFFSET_Y = includeNumbers ? OFFSET_Y + 70 : OFFSET_Y;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(currentLayoutData).forEach((key) => {
      const pos = currentLayoutData[key];
      const x = pos.x * SPACING + OFFSET_X;
      const y = pos.y * SPACING + DRAW_OFFSET_Y;
      const isLatest = text.toUpperCase().endsWith(key);
      const isActive = text.toUpperCase().includes(key);

      ctx.beginPath();
      ctx.roundRect(
        x - KEY_SIZE / 2,
        y - KEY_SIZE / 2,
        KEY_SIZE,
        KEY_SIZE,
        RADIUS,
      );

      if (isLatest && text.length > 0) {
        ctx.fillStyle = colors.accent;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = colors.background;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
      }

      ctx.fill();
      ctx.stroke();

      ctx.font = "500 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = colors.foreground;
      ctx.fillText(key, x, y);
    });
  }, [text, layout, includeNumbers, color]);

  // 3. DRAW SIGNATURE LAYER
  useEffect(() => {
    const canvas = pathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentLayoutData = getKeyboardLayout(layout, includeNumbers);
    const DRAW_OFFSET_Y = includeNumbers ? OFFSET_Y + 70 : OFFSET_Y;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;

      if (strokeStyle === "gradient") {
        const xCoords = pixelPoints.map((p) => p.x);
        const yCoords = pixelPoints.map((p) => p.y);
        const minX = Math.min(...xCoords);
        const maxX = Math.max(...xCoords);
        const minY = Math.min(...yCoords);
        const maxY = Math.max(...yCoords);

        // Gradient Bug Fix: Ensure length is never 0
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
    curveType,
    color,
    color2,
    strokeWidth,
    strokeStyle,
    layout,
    includeNumbers,
  ]);

  // Determine if keyboard should be visible
  // It shows if: No text is entered OR User is currently typing
  const showKeyboard = text.length === 0 || isTyping;

  // 1. EXPORT AS PNG
  const exportPng = () => {
    const canvas = pathCanvasRef.current;
    if (!canvas) return;

    // Create a temporary link
    const link = document.createElement("a");
    link.download = `signature-${text || "design"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // 2. EXPORT AS SVG
  const exportSvg = () => {
    const currentLayoutData = getKeyboardLayout(layout, includeNumbers);
    const DRAW_OFFSET_Y = includeNumbers ? OFFSET_Y + 70 : OFFSET_Y;

    // Get points identical to how canvas draws them
    const points = text
      .toUpperCase()
      .split("")
      .map((char) => currentLayoutData[char])
      .filter((p) => !!p);

    if (points.length < 2) return;

    const pixelPoints = points.map((p) => ({
      x: p.x * SPACING + OFFSET_X,
      y: p.y * SPACING + DRAW_OFFSET_Y,
    }));

    // Reuse your generatePath function
    const d = generatePath(pixelPoints, curveType);

    // Create SVG Blob
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
        <path
          d="${d}"
          fill="none"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `.trim();

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `signature-${text || "design"}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-2 py-6 bg-background transition-colors duration-500">
      {/* Header & Options */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold tracking-tight opacity-80">
          Digitized Signature
        </h1>
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
      </div>

      {/* Visible Themed Input */}
      <div className="relative w-full max-w-md mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your name"
          className="w-full bg-transparent border-b-2 border-muted hover:border-primary focus:border-primary outline-none py-4 text-3xl font-medium text-center transition-all duration-300 placeholder:text-muted-foreground/30"
          autoFocus
        />
        {text.length > 0 && (
          <Button
            onClick={() => setText("")}
            variant={"ghost"}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </Button>
        )}
      </div>

      {/* The Drawing Area */}
      <div className="relative w-full max-w-6xl h-140 flex items-center justify-center">
        {/* LAYER 1: The Keyboard (With Motion) */}
        <motion.div
          animate={{
            opacity: showKeyboard ? 1 : 0,
            scale: showKeyboard ? 1 : 0.97,
            filter: showKeyboard ? "blur(0px)" : "blur(10px)",
          }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="absolute inset-0 z-0"
        >
          <canvas
            ref={keyboardCanvasRef}
            width={1200}
            height={600}
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* LAYER 2: The Signature Path (Always crisp) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <canvas
            ref={pathCanvasRef}
            width={1200}
            height={600}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Added gap and margin */}
        <ButtonGroup>
          <Button className="cursor-pointer" onClick={exportSvg}>
            Export Svg
          </Button>
          <ButtonGroupSeparator />
          <Button className="cursor-pointer" onClick={exportPng}>
            Export Png
          </Button>
        </ButtonGroup>
        <Button
          variant="outline"
          asChild // Use asChild if using a Next.js Link
        >
          <a
            href="https://github.com/your-username/your-repo"
            target="_blank"
            rel="noreferrer"
          >
            View on Github
          </a>
        </Button>
      </div>
    </div>
  );
};

export default KeyboardSignature;
