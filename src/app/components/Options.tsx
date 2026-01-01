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
import { ChevronDown, Keyboard, Palette, Settings2 } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonGroup } from "@/components/ui/button-group";

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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings2 className="w-4 h-4" />
          <span>Options</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-5 rounded-2xl shadow-2xl space-y-6"
        align="start"
      >
        {/* SECTION: KEYBOARD */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
            <Keyboard className="w-3 h-3" />
            <span>Keyboard Configuration</span>
          </div>

          <div className="grid grid-cols-1 gap-4  p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Layout</Label>
              <Select
                value={layout}
                onValueChange={(v) => setLayout(v as KeyboardLayout)}
              >
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(KeyboardLayout).map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Include Numbers</Label>
              <Switch
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
          </div>
        </div>

        {/* SECTION: STYLE */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
            <Palette className="w-3 h-3" />
            <span>Visual Style</span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Style</Label>
              <div className="flex p-0.5 rounded-md border">
                {(["solid", "gradient"] as const).map((s) => (
                  <ButtonGroup aria-label="Button group" key={s}>
                    <Button
                      key={s}
                      onClick={() => setStrokeStyle(s)}
                      variant={"ghost"}
                      className="uppercase text-xs"
                    >
                      {s}
                    </Button>
                  </ButtonGroup>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">
                {strokeStyle === "gradient" ? "Colors" : "Color"}
              </Label>
              <div className="flex items-center gap-2">
                <ColorPicker value={color} onChange={setColor} />
                {strokeStyle === "gradient" && (
                  <>
                    <ColorPicker value={color2} onChange={setColor2} />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex justify-between">
                <Label className="text-xs">Stroke Width</Label>
                <span className="text-[10px] font-mono">{strokeWidth}px</span>
              </div>
              <Slider
                value={[strokeWidth]}
                onValueChange={(v) => setStrokeWidth(v[0])}
                max={8}
                min={2}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* SECTION: GEOMETRY */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
            <Settings2 className="w-3 h-3" />
            <span>Curve</span>
          </div>
          <Select
            value={curveType}
            onValueChange={(v) => setCurveType(v as CurveType)}
          >
            <SelectTrigger className="w-full h-9 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {curveOptions.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type.replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-sm "
          onClick={() => {
            setLayout("qwerty");
            setIncludeNumbers(false);
            setStrokeStyle("solid");
            setColor("#FFFFFF");
            setStrokeWidth(3);
            setCurveType("linear");
          }}
        >
          Reset to Default
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default Options;
