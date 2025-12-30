import { KeyboardLayout, CurveType } from "@/lib/util/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { ColorPicker } from "./ColorPicker";
import { Slider } from "components/ui/slider";

interface OptionsProps {
  layout: KeyboardLayout;
  setLayout: (l: KeyboardLayout) => void;
  curveType: CurveType;
  setCurveType: (c: CurveType) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (v: boolean) => void;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  strokeStyle: "solid" | "gradient";
  setStrokeStyle: (s: "solid" | "gradient") => void;
  color2: string;
  setColor2: (c: string) => void;
}

const Options = ({
  layout,
  setLayout,
  curveType,
  setCurveType,
  includeNumbers,
  setIncludeNumbers,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  strokeStyle,
  setStrokeStyle,
  color2,
  setColor2,
}: OptionsProps) => {
  const curveOptions: CurveType[] = [
    "linear",
    "simple-curve",
    "quadratic-bezier",
    "cubic-bezier",
    "catmull-rom",
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 rounded-2xl border">
      {/* 1. Layout Selection (Keeping Shadcn Select here for better space management) */}
      <div className="flex items-center gap-4">
        <p className=" text-sm font-medium whitespace-nowrap">Layout</p>
        <Select
          value={layout}
          onValueChange={(v) => setLayout(v as KeyboardLayout)}
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Select Layout" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(KeyboardLayout).map((l) => (
              <SelectItem key={l} value={l}>
                {l.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inside Options.tsx */}
      <div className="flex items-center gap-3 border-l  pl-4">
        <Label htmlFor="numbers" className="text-sm font-medium">
          Numbers
        </Label>
        <Switch
          id="numbers"
          checked={includeNumbers}
          onCheckedChange={(checked) => setIncludeNumbers(checked)}
        />
      </div>

      {/* Inside Options.tsx return */}
      <div className="flex items-center gap-4 border-l pl-4">
        <p className="text-sm font-medium">Style</p>
        <div className="flex gap-1 p-1 rounded-full border ">
          {(["solid", "gradient"] as const).map((style) => (
            <button
              key={style}
              onClick={() => setStrokeStyle(style)}
              className={`px-3 py-1 text-[10px] uppercase tracking-tighter rounded-full transition-all cursor-pointer ${
                strokeStyle === style
                  ? "bg-white text-black font-bold"
                  : "text-neutral-500 hover:text-neutral-200"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      {/* Inside the Style Section of Options.tsx */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm uppercase tracking-widest font-bold">Color</p>
        <div className="flex items-center gap-2">
          <ColorPicker value={color} onChange={setColor} />

          {/* Show second picker only for gradients */}
          {strokeStyle === "gradient" && (
            <>
              <span className="text-neutral-500">→</span>
              <ColorPicker value={color2} onChange={setColor2} />
            </>
          )}

          <label htmlFor="stroke-width" className="ml-2">
            Width:
          </label>
          <Slider
            value={[strokeWidth]}
            onValueChange={(v) => setStrokeWidth(v[0])}
            max={8}
            min={2}
            step={1}
            className="w-24"
          />
          <p className="text-xs font-mono w-8">{strokeWidth}px</p>
        </div>
      </div>

      {/* 2. Curve Selection (Your New Custom Implementation) */}
      <div className="flex items-center gap-4">
        <p className=" text-sm font-medium whitespace-nowrap">Curve</p>
        <div className="flex flex-wrap gap-1">
          {curveOptions.map((type) => (
            <button
              key={type}
              onClick={() => setCurveType(type)}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-150 ease-out cursor-pointer border ${
                curveType === type
                  ? "bg-white text-black font-medium border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "bg-neutral-900/50 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 border-neutral-800"
              }`}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Options;
