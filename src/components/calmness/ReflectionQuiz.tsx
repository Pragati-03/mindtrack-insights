import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  "What is one thing that made you smile today?",
  "What are you grateful for in this moment?",
  "What is something you did well recently?",
  "Who is someone that supports you?",
  "What is one thing you're looking forward to?",
];

export const ReflectionQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers(Array(5).fill(""));
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6 space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Reflection Complete!</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Taking time to reflect helps build emotional awareness and gratitude.
        </p>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reflect Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentQuestion
                  ? "bg-primary"
                  : i < currentQuestion
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <p className="font-medium">{questions[currentQuestion]}</p>
          <Textarea
            placeholder="Take a moment to reflect..."
            value={answers[currentQuestion]}
            onChange={(e) => handleAnswer(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button size="sm" onClick={handleNext}>
          {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
          {currentQuestion < questions.length - 1 && (
            <ChevronRight className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>
    </div>
  );
};
