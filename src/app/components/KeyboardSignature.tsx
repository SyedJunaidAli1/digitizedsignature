"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  KeyboardLayout,
  CurveType,
  generatePath,
  getKeyboardLayout,
} from "@/lib/util/constant";
import Options from "@/app/components/Options";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import ThemeToggle from "./themeToggle";

const KeyboardSignature = () => {
  const [text, setText] = useState("");
  const [layout, setLayout] = useState<KeyboardLayout>(KeyboardLayout.QWERTY);
  const [curveType, setCurveType] = useState<CurveType>("linear");
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [color2, setColor2] = useState("#ec4899");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "gradient">("solid");

  // typing / visibility
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // geometry (SINGLE SOURCE OF TRUTH)
  const SPACING = 60; // grid size
  const KEY_SIZE = 56; // visual key box
  const BASE_Y = includeNumbers ? 75 : 15; // vertical offset for rows

  // typing logic
  useEffect(() => {
    if (text.length > 0) {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1200);
    } else {
      setIsTyping(false);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [text]);

  const showKeyboard = text.length === 0 || isTyping;

  // keyboard layout
  const keyboardLayoutData = useMemo(
    () => getKeyboardLayout(layout, includeNumbers),
    [layout, includeNumbers],
  );

  const activeKeys = useMemo(
    () => new Set(text.toUpperCase().split("")),
    [text],
  );

  // 🔥 FIXED: points go through CENTER of keys
  const signaturePoints = useMemo(() => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => keyboardLayoutData[char])
      .filter(Boolean)
      .map((p) => ({
        x: p.x * SPACING + KEY_SIZE / 2,
        y: p.y * SPACING + BASE_Y + KEY_SIZE / 2,
      }));
  }, [text, keyboardLayoutData, includeNumbers]);

  const signaturePath =
    signaturePoints.length >= 2 ? generatePath(signaturePoints, curveType) : "";

  // exports
  const exportSvg = () => {
    if (!signaturePath) return;

    const h = includeNumbers ? 260 : 200;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="650" height="${h}">
        <defs>
          ${
            strokeStyle === "gradient"
              ? `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stop-color="${color}" />
                   <stop offset="100%" stop-color="${color2}" />
                 </linearGradient>`
              : ""
          }
        </defs>
        <path
          d="${signaturePath}"
          fill="none"
          stroke="${strokeStyle === "solid" ? color : "url(#g)"}"
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `.trim();

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = () => {
    const svg = document.querySelector("#signature-svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const img = new Image();
    const canvas = document.createElement("canvas");
    canvas.width = 1300;
    canvas.height = includeNumbers ? 520 : 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = "signature.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgStr);
  };

  return (
    <div className="relative min-h-screen bg-background px-2 py-6">
      {/* header + options */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold tracking-tight opacity-80">
            Digitized Signature
          </h1>
          <section className="flex gap-2">
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
              setText={setText}
              text={text}
            />
            <ThemeToggle />
          </section>
        </div>

        {/* input */}
        <div className="relative w-full max-w-md mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-transparent border-b-2 border-muted hover:border-primary focus:border-primary outline-none py-4 text-3xl font-medium text-center transition-all duration-300 placeholder:text-muted-foreground/30"
          />
          {text && (
            <Button
              variant="ghost"
              onClick={() => setText("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* keyboard + signature */}
      <div className="flex justify-center mt-6 mb-2">
        <div className="relative">
          <motion.div
            animate={{ opacity: showKeyboard ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
            style={{
              width: 650,
              height: includeNumbers ? 260 : 200,
            }}
          >
            {Object.entries(keyboardLayoutData).map(([char, pos]) => {
              const isActive = activeKeys.has(char);
              const isLatest = text.toUpperCase().endsWith(char);

              return (
                <div
                  key={char}
                  className={`absolute w-14 h-12 rounded-lg border flex items-center justify-center text-sm font-mono transition-all duration-200
                    ${
                      isLatest
                        ? "bg-primary text-primary-foreground scale-110"
                        : isActive
                          ? "bg-muted text-foreground"
                          : "bg-transparent text-muted-foreground border-border"
                    }
                  `}
                  style={{
                    left: pos.x * SPACING,
                    top: pos.y * SPACING + BASE_Y,
                  }}
                >
                  {char}
                </div>
              );
            })}
          </motion.div>

          <svg
            id="signature-svg"
            className="absolute top-0 left-0 pointer-events-none"
            width={650}
            height={includeNumbers ? 260 : 200}
          >
            <defs>
              {strokeStyle === "gradient" && (
                <linearGradient
                  id="signatureGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={color} />
                  <stop offset="100%" stopColor={color2} />
                </linearGradient>
              )}
            </defs>

            {signaturePath && (
              <path
                d={signaturePath}
                stroke={
                  strokeStyle === "solid" ? color : "url(#signatureGradient)"
                }
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
      </div>

      {/* fixed actions */}
      <div>
        {/* actions – appear after typing */}
        <AnimatePresence>
          {text.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-4 items-center backdrop-blur-md p-4 rounded-xl"
            >
              <ButtonGroup>
                <Button onClick={exportSvg}>Export SVG</Button>
                <ButtonGroupSeparator />
                <Button onClick={exportPng}>Export PNG</Button>
              </ButtonGroup>

              <Button variant="outline" asChild>
                <a
                  href="https://github.com/SyedJunaidAli1/digitizedsignature"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KeyboardSignature;
