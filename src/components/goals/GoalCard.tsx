import { motion } from "framer-motion";
import { Check, Flame, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  title: string;
  description?: string;
  progress: number;
  streak: number;
  completedToday?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
}

export function GoalCard({
  title,
  description,
  progress,
  streak,
  completedToday = false,
  onToggle,
  onEdit,
}: GoalCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        variant={completedToday ? "sage" : "glass"}
        className="cursor-pointer"
        onClick={onToggle}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-primary/20 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  completedToday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/20"
                )}
              >
                <Check className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Weekly Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {streak > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-sm">
              <Flame className="w-4 h-4 text-coral" />
              <span className="font-medium text-coral">{streak} day streak!</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
