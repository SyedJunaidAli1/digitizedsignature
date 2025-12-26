import { KeyboardLayout, CurveType } from "@/src/lib/util/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OptionsProps {
  layout: KeyboardLayout;
  setLayout: (l: KeyboardLayout) => void;
  curveType: CurveType;
  setCurveType: (c: CurveType) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (v: boolean) => void;
}

const Options = ({
  layout,
  setLayout,
  curveType,
  setCurveType,
  includeNumbers,
  setIncludeNumbers,
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
      <div className="flex items-center gap-3 border-l border-neutral-800 pl-8">
        <Label htmlFor="numbers" className="text-sm font-medium">
          Numbers
        </Label>
        <Switch
          id="numbers"
          checked={includeNumbers}
          onCheckedChange={(checked) => setIncludeNumbers(checked)}
        />
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
