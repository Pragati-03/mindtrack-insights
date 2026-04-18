import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Sparkles, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoodQuoteProps {
  moodScore: number | null;
  userId: string;
}

export function MoodQuote({ moodScore, userId }: MoodQuoteProps) {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const getMoodCategory = (score: number | null): string => {
    if (score === null) return "neutral";
    if (score <= 25) return "low";
    if (score <= 50) return "anxious";
    if (score <= 75) return "neutral";
    return "positive";
  };

  const getDefaultQuote = (category: string): string => {
    const quotes: Record<string, string[]> = {
      low: [
        "Every storm runs out of rain. Hold on, brighter days are coming.",
        "You are stronger than you know. This difficult moment will pass.",
        "It's okay to not be okay. Your feelings are valid, and you matter.",
      ],
      anxious: [
        "Take a deep breath. You are exactly where you need to be right now.",
        "Ground yourself in this moment. The future will unfold one step at a time.",
        "You have survived 100% of your worst days. You've got this.",
      ],
      neutral: [
        "Today is full of possibilities. What small joy can you discover?",
        "Every day is a fresh start. Be gentle with yourself.",
        "You are doing better than you think. Keep going.",
      ],
      positive: [
        "Your positive energy is contagious! Use it to lift others up today.",
        "Growth happens when we step outside our comfort zone. What will you try today?",
        "You're in a great headspace. Set a meaningful intention for the day!",
      ],
    };
    const categoryQuotes = quotes[category] || quotes.neutral;
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  };

  const generateQuote = async () => {
    setIsLoading(true);
    const category = getMoodCategory(moodScore);

    try {
      const moodPrompt = {
        low: "The user is feeling low or sad today. Generate a short, warm, comforting motivational quote (max 2 sentences) that acknowledges their feelings and offers gentle encouragement.",
        anxious: "The user is feeling anxious or stressed. Generate a short, calming, grounding motivational quote (max 2 sentences) focused on breathing, being present, and inner strength.",
        neutral: "The user is feeling neutral today. Generate a short, uplifting motivational quote (max 2 sentences) about possibilities and self-compassion.",
        positive: "The user is feeling great today! Generate a short, empowering growth-mindset quote (max 2 sentences) that encourages them to spread positivity or take on new challenges.",
      };

      const response = await supabase.functions.invoke("wellness-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `${moodPrompt[category as keyof typeof moodPrompt]} Only respond with the quote, no explanation or attribution.`,
            },
          ],
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Handle streaming response
      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                fullText += content;
              }
            } catch {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      if (fullText.trim()) {
        setQuote(fullText.trim().replace(/^["']|["']$/g, ""));
      } else {
        setQuote(getDefaultQuote(category));
      }
    } catch (error) {
      console.error("Error generating quote:", error);
      // Use fallback quote on error
      setQuote(getDefaultQuote(category));
    } finally {
      setIsLoading(false);
      setHasGenerated(true);
    }
  };

  useEffect(() => {
    // Generate initial quote based on mood
    const category = getMoodCategory(moodScore);
    setQuote(getDefaultQuote(category));
  }, [moodScore]);

  const getMoodIcon = () => {
    const category = getMoodCategory(moodScore);
    if (category === "low" || category === "anxious") {
      return <Heart className="w-5 h-5 text-rose-500" />;
    }
    return <Sparkles className="w-5 h-5 text-amber-500" />;
  };

  const getMoodLabel = () => {
    const category = getMoodCategory(moodScore);
    const labels: Record<string, string> = {
      low: "Comforting thought for you",
      anxious: "A grounding reminder",
      neutral: "Daily inspiration",
      positive: "Growth mindset boost",
    };
    return labels[category] || "Daily inspiration";
  };

  return (
    <Card variant="glass" className="overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-60" />
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center flex-shrink-0">
            <Quote className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getMoodIcon()}
              <span className="text-sm font-medium text-muted-foreground">
                {getMoodLabel()}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-foreground font-medium leading-relaxed italic"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-muted-foreground not-italic">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating your quote...
                  </span>
                ) : (
                  `"${quote}"`
                )}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={generateQuote}
            disabled={isLoading}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            {hasGenerated ? "New AI Quote" : "Get AI Quote"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
