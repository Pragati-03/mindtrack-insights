import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export const BreathingBubble = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(0);

  const phaseDurations = { inhale: 4, hold: 4, exhale: 4 };
  const totalCycle = 12;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = (prev + 1) % totalCycle;
        if (next < 4) setPhase("inhale");
        else if (next < 8) setPhase("hold");
        else setPhase("exhale");
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setSeconds(0);
  };

  const getPhaseProgress = () => {
    if (phase === "inhale") return seconds + 1;
    if (phase === "hold") return seconds - 3;
    return seconds - 7;
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative flex items-center justify-center w-48 h-48">
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-primary/30 to-accent/30"
          animate={{
            scale: phase === "inhale" ? [0.6, 1] : phase === "exhale" ? [1, 0.6] : 1,
          }}
          transition={{
            duration: phaseDurations[phase],
            ease: "easeInOut",
          }}
          style={{ width: "100%", height: "100%" }}
        />
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-primary/50 to-accent/50"
          animate={{
            scale: phase === "inhale" ? [0.5, 0.85] : phase === "exhale" ? [0.85, 0.5] : 0.85,
          }}
          transition={{
            duration: phaseDurations[phase],
            ease: "easeInOut",
          }}
          style={{ width: "80%", height: "80%" }}
        />
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          animate={{
            scale: phase === "inhale" ? [0.4, 0.7] : phase === "exhale" ? [0.7, 0.4] : 0.7,
          }}
          transition={{
            duration: phaseDurations[phase],
            ease: "easeInOut",
          }}
          style={{ width: "60%", height: "60%" }}
        >
          <span className="text-primary-foreground font-semibold text-lg capitalize">
            {phase}
          </span>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          {phase === "inhale" && "Breathe in slowly..."}
          {phase === "hold" && "Hold your breath..."}
          {phase === "exhale" && "Breathe out gently..."}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {getPhaseProgress()} / {phaseDurations[phase]}s
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsActive(!isActive)}
          className="gap-2"
        >
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
