// "use client";
// import { useState, useEffect, useRef } from "react";

// // Organized Key Map (Row by Row)
// const KEYBOARD_LAYOUT = [
//   ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
//   ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
//   ["z", "x", "c", "v", "b", "n", "m"],
// ];

// // Map characters to [x, y] coordinatest
// const KEY_MAP = {};
// KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
//   row.forEach((key, keyIndex) => {
//     // Offset rows to mimic a real keyboard staggering
//     const offset = rowIndex * 20;
//     KEY_MAP[key] = [100 + keyIndex * 60 + offset, 80 + rowIndex * 70];
//   });
// });

// const KeyboardSignature = () => {
//   const [text, setText] = useState("");
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // Clear and Setup
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // 1. Draw the "Ghost" Keyboard Background
//     ctx.font = "14px Inter, sans-serif";
//     ctx.textAlign = "center";

//     Object.keys(KEY_MAP).forEach((key) => {
//       const [x, y] = KEY_MAP[key];
//       const isActive = text.toLowerCase().includes(key);

//       // Draw Key Circle/Background
//       ctx.beginPath();
//       ctx.arc(x, y, 18, 0, Math.PI * 2);
//       ctx.fillStyle = isActive
//         ? "rgba(99, 102, 241, 0.2)"
//         : "rgba(255, 255, 255, 0.03)";
//       ctx.fill();

//       // Draw Key Letter
//       ctx.fillStyle = isActive ? "#818cf8" : "#3f3f46";
//       ctx.fillText(key.toUpperCase(), x, y + 5);
//     });

//     // 2. Draw the Signature Line
//     const points = text
//       .toLowerCase()
//       .split("")
//       .map((char) => KEY_MAP[char])
//       .filter((p) => !!p);

//     if (points.length >= 2) {
//       ctx.beginPath();
//       ctx.lineWidth = 3;
//       ctx.strokeStyle = "#6366f1";
//       ctx.shadowBlur = 12;
//       ctx.shadowColor = "#6366f1";
//       ctx.lineJoin = "round";
//       ctx.lineCap = "round";

//       ctx.moveTo(points[0][0], points[0][1]);
//       for (let i = 1; i < points.length; i++) {
//         ctx.lineTo(points[i][0], points[i][1]);
//       }
//       ctx.stroke();
//       ctx.shadowBlur = 0; // Reset shadow for other elements
//     }
//   }, [text]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-6">
//       <div className="max-w-3xl w-full space-y-8">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
//             KEYBOARD SIGNATURE
//           </h1>
//           <p className="text-zinc-500">
//             Visualize the geometry of your typing.
//           </p>
//         </div>

//         <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
//           <div className="mt-8 relative">
//             <input
//               type="text"
//               autoFocus
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Start typing..."
//               className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
//             />
//           </div>
//           <canvas
//             ref={canvasRef}
//             width={750}
//             height={300}
//             className="w-full h-auto"
//           />
//         </div>

//         <div className="flex justify-between text-xs text-zinc-600 uppercase tracking-widest px-2">
//           <span>Generative Art v1.0</span>
//           <span>Based on QWERTY Coordinates</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KeyboardSignature;

"use client";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import everything from your constants file
import {
  KeyboardLayout,
  keyboardLayouts,
  generatePath,
  CurveType,
} from "@/src/lib/util/constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Options from "../components/Options";

const KeyboardSignature = () => {
  const [text, setText] = useState("");
  const [layout, setLayout] = useState<KeyboardLayout>(KeyboardLayout.QWERTY);
  const [curveType, setCurveType] = useState<CurveType>("catmull-rom");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing Constants
  const SCALE = 70;
  const OFFSET_X = 50;
  const OFFSET_Y = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use the layout data from your constants.ts
    const currentLayoutData = keyboardLayouts[layout];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Keyboard Background
    Object.keys(currentLayoutData).forEach((key) => {
      const pos = currentLayoutData[key];
      const x = pos.x * SCALE + OFFSET_X;
      const y = pos.y * SCALE + OFFSET_Y;
      const isActive = text.toUpperCase().includes(key);

      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = isActive
        ? "rgba(99, 102, 241, 0.2)"
        : "rgba(255, 255, 255, 0.02)";
      ctx.fill();
    });

    // 2. Draw Signature Path using your generatePath logic
    const points = text
      .toUpperCase()
      .split("")
      .map((char) => currentLayoutData[char])
      .filter((p) => !!p);

    if (points.length >= 2) {
      // Map your logical coordinates to Canvas pixels
      const pixelPoints = points.map((p) => ({
        x: p.x * SCALE + OFFSET_X,
        y: p.y * SCALE + OFFSET_Y,
      }));

      // Get the SVG Path string from your logic
      const pathData = generatePath(pixelPoints, curveType);

      // Draw the path to Canvas
      const path = new Path2D(pathData);

      ctx.shadowBlur = 15;
      ctx.shadowColor = "#6366f1";
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke(path);
    }
  }, [text, layout, curveType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full space-y-6">
        <div>
          <Options
            layout={layout}
            setLayout={setLayout}
            curveType={curveType}
            setCurveType={setCurveType}
          />
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 backdrop-blur-md">
          <canvas
            ref={canvasRef}
            width={750}
            height={300}
            className="w-full h-auto"
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your signature..."
            className="w-full mt-10 bg-transparent border-b border-zinc-800 py-4 text-3xl text-center focus:outline-none focus:border-indigo-500 transition-all font-light tracking-widest"
          />
        </div>
      </div>
    </div>
  );
};

export default KeyboardSignature;
