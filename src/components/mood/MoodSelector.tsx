import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const moods = [
  { emoji: "😊", label: "Happy", value: "happy", color: "bg-amber-100 hover:bg-amber-200" },
  { emoji: "😌", label: "Calm", value: "calm", color: "bg-sky/50 hover:bg-sky" },
  { emoji: "😐", label: "Neutral", value: "neutral", color: "bg-muted hover:bg-muted/80" },
  { emoji: "😔", label: "Sad", value: "sad", color: "bg-blue-100 hover:bg-blue-200" },
  { emoji: "😤", label: "Angry", value: "angry", color: "bg-red-100 hover:bg-red-200" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "bg-lavender hover:bg-lavender/80" },
  { emoji: "😴", label: "Tired", value: "tired", color: "bg-slate-100 hover:bg-slate-200" },
  { emoji: "🤗", label: "Grateful", value: "grateful", color: "bg-peach hover:bg-peach/80" },
];

interface MoodSelectorProps {
  selectedMood?: string;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.value)}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 border-2",
            mood.color,
            selectedMood === mood.value
              ? "border-primary shadow-medium ring-2 ring-primary/20"
              : "border-transparent"
          )}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs font-medium text-foreground">{mood.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
