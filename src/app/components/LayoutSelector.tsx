// components/LayoutSelector.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeyboardLayout } from "@/src/lib/util/constant";

interface Props {
  value: KeyboardLayout;
  onChange: (value: KeyboardLayout) => void;
}

export function LayoutSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Keyboard Layout
      </label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as KeyboardLayout)}
      >
        <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
          <SelectValue placeholder="Select Layout" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
          <SelectItem value={KeyboardLayout.QWERTY}>QWERTY</SelectItem>
          <SelectItem value={KeyboardLayout.AZERTY}>AZERTY</SelectItem>
          <SelectItem value={KeyboardLayout.COLEMAK}>COLEMAK</SelectItem>
          <SelectItem value={KeyboardLayout.DVORAK}>DVORAK</SelectItem>
          <SelectItem value={KeyboardLayout.ABCDEF}>ABCDEF</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
