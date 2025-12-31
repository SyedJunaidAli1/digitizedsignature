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
  color2,
  setColor2,
  strokeStyle,
  setStrokeStyle,
  strokeWidth,
  setStrokeWidth,
}: OptionsProps) => {
  const curveOptions: CurveType[] = [
    "linear",
    "simple-curve",
    "quadratic-bezier",
    "cubic-bezier",
    "catmull-rom",
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-6 p-5 rounded-2xl border backdrop-blur-sm text-card-foreground shadow-sm">
      {/* GROUP 1: BASE CONFIG */}
      <div className="flex items-center gap-6">
        <div className="space-y-1.5">
          <Label className="text-sm uppercase tracking-wider text-muted-foreground font-bold">
            Layout
          </Label>
          <Select
            value={layout}
            onValueChange={(v) => setLayout(v as KeyboardLayout)}
          >
            <SelectTrigger className="w-32 h-9 bg-background">
              <SelectValue />
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

        <div className="space-y-2.5 flex flex-col items-center">
          <Label
            htmlFor="numbers"
            className="text-sm uppercase tracking-wider text-muted-foreground font-bold"
          >
            Numbers
          </Label>
          <Switch
            id="numbers"
            checked={includeNumbers}
            onCheckedChange={setIncludeNumbers}
          />
        </div>
      </div>

      <div className="h-10 bg-border hidden md:block" />

      {/* GROUP 2: STROKE STYLE */}
      <div className="flex items-center gap-6">
        <div className="space-y-1.5">
          <Label className="text-sm uppercase tracking-wider text-muted-foreground font-bold">
            Appearance
          </Label>
          <div className="flex items-center gap-3 h-9">
            <div className="flex p-1 rounded-md border bg-background">
              {(["solid", "gradient"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setStrokeStyle(style)}
                  className={`px-3 py-1 text-sm uppercase font-bold rounded-sm transition-all ${
                    strokeStyle === style
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <ColorPicker value={color} onChange={setColor} />
              {strokeStyle === "gradient" && (
                <>
                  <ColorPicker value={color2} onChange={setColor2} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 min-w-30">
          <div className="flex justify-between items-center">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-bold">
              Width
            </Label>
            <span className="text-sm font-mono font-medium">
              {strokeWidth}px
            </span>
          </div>
          <Slider
            value={[strokeWidth]}
            onValueChange={(v) => setStrokeWidth(v[0])}
            max={8}
            min={2}
            step={1}
            className="py-3"
          />
        </div>
      </div>

      <div className="h-10 bg-border hidden lg:block" />

      {/* GROUP 3: CURVE TYPE */}
      <div className="space-y-1.5 flex-1">
        <Label className="text-sm uppercase tracking-wider text-muted-foreground font-bold">
          Curve
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {curveOptions.map((type) => (
            <button
              key={type}
              onClick={() => setCurveType(type)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
                curveType === type
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground hover:border-muted-foreground hover:text-foreground"
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
