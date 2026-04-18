import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

const moodLabels = [
  { value: 0, emoji: "😢", label: "Very Low", color: "text-blue-500" },
  { value: 25, emoji: "😔", label: "Low", color: "text-slate-500" },
  { value: 50, emoji: "😐", label: "Okay", color: "text-amber-500" },
  { value: 75, emoji: "🙂", label: "Good", color: "text-emerald-500" },
  { value: 100, emoji: "😊", label: "Great", color: "text-primary" },
];

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  showLabel?: boolean;
}

export function MoodSlider({ value, onChange, showLabel = true }: MoodSliderProps) {
  const getCurrentMood = () => {
    if (value <= 12) return moodLabels[0];
    if (value <= 37) return moodLabels[1];
    if (value <= 62) return moodLabels[2];
    if (value <= 87) return moodLabels[3];
    return moodLabels[4];
  };

  const currentMood = getCurrentMood();

  return (
    <div className="space-y-4">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">How's your mood?</span>
          <motion.div
            key={currentMood.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">{currentMood.emoji}</span>
            <span className={`text-sm font-semibold ${currentMood.color}`}>
              {currentMood.label}
            </span>
          </motion.div>
        </div>
      )}

      <div className="relative pt-2">
        <Slider
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          max={100}
          step={1}
          className="w-full"
        />
        
        {/* Mood markers */}
        <div className="flex justify-between mt-3">
          {moodLabels.map((mood) => (
            <button
              key={mood.value}
              onClick={() => onChange(mood.value)}
              className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-lg">{mood.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
