import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JournalEntryProps {
  date: Date;
  mood: string;
  content: string;
  tags?: string[];
  sentiment?: "positive" | "neutral" | "negative";
  onClick?: () => void;
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  sad: "😔",
  angry: "😤",
  anxious: "😰",
  tired: "😴",
  grateful: "🤗",
};

const sentimentColors = {
  positive: "bg-emerald-100 text-emerald-700",
  neutral: "bg-slate-100 text-slate-700",
  negative: "bg-red-100 text-red-700",
};

export function JournalEntry({
  date,
  mood,
  content,
  tags = [],
  sentiment = "neutral",
  onClick,
}: JournalEntryProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card variant="glass" className="cursor-pointer" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{moodEmojis[mood] || "😊"}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  {format(date, "EEEE, MMM d")}
                </span>
                <Badge className={cn("text-xs", sentimentColors[sentiment])}>
                  {sentiment}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {content}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
