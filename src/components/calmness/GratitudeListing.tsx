import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const GratitudeListing = () => {
  const [items, setItems] = useState(["", "", ""]);
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (items.some((item) => item.trim())) {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setItems(["", "", ""]);
    setIsComplete(false);
  };

  const filledCount = items.filter((item) => item.trim()).length;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-6 space-y-4"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto"
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          <h3 className="font-semibold text-lg">Gratitude Captured!</h3>
          <p className="text-muted-foreground text-sm">
            Here's what you're grateful for today:
          </p>
        </div>

        <div className="space-y-2">
          {items.filter((item) => item.trim()).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10"
            >
              <Heart className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Add More Gratitude
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          List 3 things you're grateful for today
        </p>
        <p className="text-xs text-muted-foreground">
          {filledCount}/3 completed
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">{index + 1}</span>
              </div>
              <Input
                placeholder={`I'm grateful for...`}
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                className="flex-1"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={filledCount === 0}
      >
        <Heart className="h-4 w-4 mr-2" />
        Save Gratitude
      </Button>
    </div>
  );
};
