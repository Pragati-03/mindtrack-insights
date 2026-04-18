import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface StressSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const stressLevels = [
  { label: "Very Low", color: "text-primary" },
  { label: "Low", color: "text-emerald-500" },
  { label: "Moderate", color: "text-amber-500" },
  { label: "High", color: "text-orange-500" },
  { label: "Very High", color: "text-destructive" },
];

export function StressSlider({ value, onChange }: StressSliderProps) {
  const stressIndex = Math.min(Math.floor(value / 20), 4);
  const currentLevel = stressLevels[stressIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Stress Level</span>
        <span className={cn("text-sm font-semibold", currentLevel.color)}>
          {currentLevel.label}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={100}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Relaxed</span>
        <span>Stressed</span>
      </div>
    </div>
  );
}
