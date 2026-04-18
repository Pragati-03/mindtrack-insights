import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Target, Sparkles, ArrowRight, Check, Flower2 } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodSlider } from "@/components/mood/MoodSlider";
import { WellnessChat } from "@/components/chat/WellnessChat";
import { MoodQuote } from "@/components/home/MoodQuote";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const quickActions = [
  {
    icon: BookOpen,
    title: "Write Journal",
    description: "Record your thoughts",
    path: "/journal",
    color: "bg-sage-light text-primary",
  },
  {
    icon: BarChart3,
    title: "View Insights",
    description: "See your trends",
    path: "/dashboard",
    color: "bg-lavender text-violet-600",
  },
  {
    icon: Target,
    title: "Track Goals",
    description: "Check your habits",
    path: "/goals",
    color: "bg-peach text-coral",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [moodValue, setMoodValue] = useState(50);
  const [savingMood, setSavingMood] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);
  const [todaysMood, setTodaysMood] = useState<number | null>(null);

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

  // Fetch today's mood if exists
  useEffect(() => {
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      supabase
        .from("mood_entries")
        .select("mood_score")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setTodaysMood(data.mood_score);
            setMoodValue(data.mood_score);
            setMoodSaved(true);
          }
        });
    }
  }, [user]);

  const handleSaveMood = async () => {
    if (!user) return;
    
    setSavingMood(true);
    
    const { error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: user.id,
        mood_score: moodValue,
      });

    setSavingMood(false);

    if (error) {
      toast({
        title: "Error saving mood",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMoodSaved(true);
      setTodaysMood(moodValue);
      toast({
        title: "Mood saved!",
        description: "Your mood has been recorded for today.",
      });
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
    navigate("/");
    return null;
  }

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Friend";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const getMoodEmoji = (score: number) => {
    if (score <= 12) return "😢";
    if (score <= 37) return "😔";
    if (score <= 62) return "😐";
    if (score <= 87) return "🙂";
    return "😊";
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation isAuthenticated={true} onLogout={handleLogout} />

      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Greeting */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-muted-foreground">
              How are you feeling today? Let's check in on your wellness journey.
            </p>
          </div>

          {/* Mood Check-in Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>How are you feeling?</span>
                  {moodSaved && (
                    <span className="text-sm font-normal text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Saved today
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MoodSlider value={moodValue} onChange={setMoodValue} showLabel={false} />
                
                {!moodSaved && (
                  <Button
                    variant="hero"
                    onClick={handleSaveMood}
                    disabled={savingMood}
                    className="w-full"
                  >
                    {savingMood ? "Saving..." : "Save My Mood"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Coach Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card variant="sage" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">Your AI Coach</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your recent entries, you've been maintaining a positive outlook.
                      Keep up the great work! 🌟
                    </p>
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => navigate("/journal")}
                      className="gap-2"
                    >
                      Write today's entry
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    variant="glass"
                    className="cursor-pointer hover:shadow-medium"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MoodQuote moodScore={todaysMood} userId={user.id} />
          </motion.div>

          {/* Quick Access to Wellness */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Card
              variant="glass"
              className="cursor-pointer hover:shadow-medium"
              onClick={() => navigate("/wellness")}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lavender text-violet-600 flex items-center justify-center">
                  <Flower2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Wellness Activities</h3>
                  <p className="text-sm text-muted-foreground">Breathing exercises, quizzes & more</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Progress */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Today's Progress</h2>
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">1</div>
                    <p className="text-xs text-muted-foreground">Entries</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-coral">3/4</div>
                    <p className="text-xs text-muted-foreground">Goals</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {todaysMood !== null ? getMoodEmoji(todaysMood) : "—"}
                    </div>
                    <p className="text-xs text-muted-foreground">Mood</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <WellnessChat />
    </div>
  );
}
