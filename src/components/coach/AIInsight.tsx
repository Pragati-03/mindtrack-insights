import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIInsightProps {
  title: string;
  message: string;
  suggestion?: string;
  onAction?: () => void;
}

export function AIInsight({ title, message, suggestion, onAction }: AIInsightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="warm" className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-xl bg-coral/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-coral" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
          {suggestion && (
            <div className="p-3 bg-card/60 rounded-xl border border-border/50">
              <p className="text-sm font-medium text-foreground">💡 {suggestion}</p>
            </div>
          )}
          {onAction && (
            <Button variant="warm" size="sm" onClick={onAction} className="gap-2">
              Try it now
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
