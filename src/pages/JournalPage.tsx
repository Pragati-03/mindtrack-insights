import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Calendar, Send } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodSelector } from "@/components/mood/MoodSelector";
import { StressSlider } from "@/components/mood/StressSlider";
import { JournalEntry } from "@/components/journal/JournalEntry";
import { AIInsight } from "@/components/coach/AIInsight";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const tags = ["Work", "Personal", "Health", "Family", "Study", "Relationships"];

interface JournalEntryType {
  id: string;
  created_at: string;
  mood: string;
  content: string;
  tags: string[];
  sentiment: string;
  stress_level: number;
}

export default function JournalPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>();
  const [stressLevel, setStressLevel] = useState(30);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch journal entries
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
    } else {
      setEntries(data || []);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    if (!selectedMood || !content.trim()) {
      toast({
        title: "Please complete your entry",
        description: "Select a mood and write something about your day.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    // Determine sentiment based on mood
    const getSentiment = (mood: string) => {
      if (["happy", "calm", "excited"].includes(mood)) return "positive";
      if (["sad", "anxious", "angry"].includes(mood)) return "negative";
      return "neutral";
    };

    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      mood: selectedMood,
      content: content.trim(),
      stress_level: stressLevel,
      tags: selectedTags,
      sentiment: getSentiment(selectedMood),
    });

    setSaving(false);

    if (error) {
      toast({
        title: "Error saving entry",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Entry saved! 📝",
        description: "Your journal entry has been recorded.",
      });

      // Reset form and refresh entries
      setIsWriting(false);
      setSelectedMood(undefined);
      setStressLevel(30);
      setContent("");
      setSelectedTags([]);
      fetchEntries();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {isWriting ? "Write Entry" : "Journal"}
              </h1>
              <p className="text-muted-foreground">
                {isWriting ? "How are you feeling today?" : "Your mood journal entries"}
              </p>
            </div>
            {!isWriting && (
              <Button variant="hero" onClick={() => setIsWriting(true)} className="gap-2">
                <Plus className="w-5 h-5" />
                New Entry
              </Button>
            )}
          </div>

          {isWriting ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Mood Selection */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    How are you feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
                </CardContent>
              </Card>

              {/* Stress Level */}
              <Card variant="glass">
                <CardContent className="pt-6">
                  <StressSlider value={stressLevel} onChange={setStressLevel} />
                </CardContent>
              </Card>

              {/* Journal Text */}
              <Card variant="glass">
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Write about your day, your thoughts, feelings..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px] resize-none bg-background/50"
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Add Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "secondary"}
                        className="cursor-pointer transition-colors"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsWriting(false)}
                  className="flex-1"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  onClick={handleSave}
                  className="flex-1 gap-2"
                  disabled={saving}
                >
                  <Send className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* AI Insight */}
              <AIInsight
                title="Your AI Coach"
                message="Based on your recent entries, you've been doing great maintaining a positive outlook! Keep focusing on work-life balance."
                suggestion="Try a 5-minute gratitude exercise before bed tonight."
              />

              {/* Recent Entries */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h2>
                {entries.length === 0 ? (
                  <Card variant="glass">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No journal entries yet. Start writing to track your mood!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <JournalEntry
                        key={entry.id}
                        date={new Date(entry.created_at)}
                        mood={entry.mood}
                        content={entry.content}
                        tags={entry.tags}
                        sentiment={entry.sentiment as "positive" | "negative" | "neutral"}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}