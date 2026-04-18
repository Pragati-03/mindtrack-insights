import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Zap, Calendar, BookOpen } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodChart } from "@/components/insights/MoodChart";
import { EmotionPieChart } from "@/components/insights/EmotionPieChart";
import { AIInsight } from "@/components/coach/AIInsight";
import { WellnessChat } from "@/components/chat/WellnessChat";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay } from "date-fns";

interface MoodEntry {
  id: string;
  mood_score: number;
  created_at: string;
}

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  sentiment: string | null;
  stress_level: number | null;
  tags: string[] | null;
  created_at: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setIsAuthenticated(true);

      // Fetch last 30 days of mood entries
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const [moodResult, journalResult] = await Promise.all([
        supabase
          .from("mood_entries")
          .select("*")
          .eq("user_id", session.user.id)
          .gte("created_at", thirtyDaysAgo)
          .order("created_at", { ascending: true }),
        supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", session.user.id)
          .gte("created_at", thirtyDaysAgo)
          .order("created_at", { ascending: true })
      ]);

      if (moodResult.data) setMoodEntries(moodResult.data);
      if (journalResult.data) setJournalEntries(journalResult.data);
      
      setLoading(false);
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Process mood data for chart (last 7 days)
  const getMoodChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, "EEE"),
        fullDate: startOfDay(date).toISOString(),
      };
    });

    return last7Days.map(day => {
      const dayEntries = moodEntries.filter(entry => {
        const entryDate = startOfDay(new Date(entry.created_at)).toISOString();
        return entryDate === day.fullDate;
      });
      
      const avgScore = dayEntries.length > 0
        ? Math.round(dayEntries.reduce((sum, e) => sum + e.mood_score, 0) / dayEntries.length)
        : null;
      
      return { date: day.date, score: avgScore ?? 0 };
    });
  };

  // Process emotion data from journal sentiments
  const getEmotionData = () => {
    const sentimentCounts: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    journalEntries.forEach(entry => {
      const sentiment = entry.sentiment || "neutral";
      if (sentimentCounts[sentiment] !== undefined) {
        sentimentCounts[sentiment]++;
      }
    });

    const total = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      return [
        { name: "No Data", value: 100, color: "#94a3b8" }
      ];
    }

    return [
      { name: "Positive", value: Math.round((sentimentCounts.positive / total) * 100), color: "#6dab9a" },
      { name: "Neutral", value: Math.round((sentimentCounts.neutral / total) * 100), color: "#94a3b8" },
      { name: "Negative", value: Math.round((sentimentCounts.negative / total) * 100), color: "#ef4444" },
    ].filter(item => item.value > 0);
  };

  // Calculate stats
  const getStats = () => {
    const avgMood = moodEntries.length > 0
      ? Math.round(moodEntries.reduce((sum, e) => sum + e.mood_score, 0) / moodEntries.length)
      : 0;

    // Calculate journal streak
    let streak = 0;
    const today = startOfDay(new Date());
    for (let i = 0; i < 30; i++) {
      const checkDate = startOfDay(subDays(today, i)).toISOString();
      const hasEntry = journalEntries.some(entry => 
        startOfDay(new Date(entry.created_at)).toISOString() === checkDate
      );
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Calculate average stress
    const stressEntries = journalEntries.filter(e => e.stress_level !== null);
    const avgStress = stressEntries.length > 0
      ? Math.round(stressEntries.reduce((sum, e) => sum + (e.stress_level || 0), 0) / stressEntries.length)
      : 0;
    
    const stressLevel = avgStress < 30 ? "Low" : avgStress < 60 ? "Medium" : "High";

    // Count unique tags/triggers
    const allTags = journalEntries.flatMap(e => e.tags || []);
    const uniqueTags = new Set(allTags);

    return { avgMood, streak, stressLevel, triggerCount: uniqueTags.size };
  };

  const stats = getStats();
  const moodChartData = getMoodChartData();
  const emotionData = getEmotionData();

  const statsCards = [
    {
      title: "Avg Mood Score",
      value: stats.avgMood.toString(),
      subtitle: "/100",
      icon: TrendingUp,
      color: "text-primary bg-sage-light",
    },
    {
      title: "Journal Streak",
      value: stats.streak.toString(),
      subtitle: "days",
      icon: Calendar,
      color: "text-coral bg-peach",
    },
    {
      title: "Stress Level",
      value: stats.stressLevel,
      subtitle: "avg",
      icon: Zap,
      color: stats.stressLevel === "Low" 
        ? "text-emerald-600 bg-emerald-100" 
        : stats.stressLevel === "Medium" 
        ? "text-amber-600 bg-amber-100"
        : "text-red-600 bg-red-100",
    },
    {
      title: "Journal Entries",
      value: journalEntries.length.toString(),
      subtitle: "total",
      icon: BookOpen,
      color: "text-violet-600 bg-violet-100",
    },
  ];

  // Generate AI summary based on actual data
  const getAISummary = () => {
    if (moodEntries.length === 0 && journalEntries.length === 0) {
      return {
        message: "Start tracking your mood and writing journal entries to see personalized insights here!",
        suggestion: "Try logging your mood today and writing about how you're feeling."
      };
    }

    const avgMood = stats.avgMood;
    const recentMoods = moodEntries.slice(-7);
    const trend = recentMoods.length >= 2 
      ? recentMoods[recentMoods.length - 1].mood_score - recentMoods[0].mood_score
      : 0;

    let message = `Based on your ${moodEntries.length} mood entries and ${journalEntries.length} journal entries, `;
    
    if (avgMood >= 70) {
      message += `you've been maintaining a positive outlook with an average mood of ${avgMood}/100. `;
    } else if (avgMood >= 40) {
      message += `your mood has been moderate with an average of ${avgMood}/100. `;
    } else {
      message += `your mood has been lower than usual with an average of ${avgMood}/100. `;
    }

    if (trend > 10) {
      message += "Your mood is trending upward recently!";
    } else if (trend < -10) {
      message += "Your mood has dipped a bit recently. That's okay - ups and downs are normal.";
    } else {
      message += "Your mood has been relatively stable.";
    }

    const suggestion = avgMood < 50 
      ? "Consider reaching out to a friend or trying a relaxation technique today."
      : stats.streak < 3 
      ? "Try to journal more consistently to track patterns better."
      : "Keep up the great work with your journaling habit!";

    return { message, suggestion };
  };

  const aiSummary = getAISummary();

  // Get triggers from tags
  const getTriggers = () => {
    const tagCounts: Record<string, { count: number; sentiment: string }> = {};
    
    journalEntries.forEach(entry => {
      (entry.tags || []).forEach(tag => {
        if (!tagCounts[tag]) {
          tagCounts[tag] = { count: 0, sentiment: entry.sentiment || "neutral" };
        }
        tagCounts[tag].count++;
        if (entry.sentiment === "negative") {
          tagCounts[tag].sentiment = "negative";
        }
      });
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([tag, data]) => ({
        name: tag,
        count: data.count,
        type: data.sentiment
      }));
  };

  const triggers = getTriggers();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="container mx-auto px-4 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Insights</h1>
            <p className="text-muted-foreground">
              Track your emotional patterns and trends
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </span>
                          {stat.subtitle && (
                            <span className="text-sm text-muted-foreground">
                              {stat.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <MoodChart data={moodChartData} />
            <EmotionPieChart data={emotionData} />
          </div>

          {/* Weekly Summary */}
          <AIInsight
            title="Your Summary"
            message={aiSummary.message}
            suggestion={aiSummary.suggestion}
          />

          {/* Trigger Analysis */}
          {triggers.length > 0 && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Common Tags in Your Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {triggers.map((trigger, index) => (
                    <div 
                      key={trigger.name}
                      className={`p-4 rounded-xl border ${
                        trigger.type === "negative" 
                          ? "bg-red-50 border-red-100 dark:bg-red-950 dark:border-red-900" 
                          : trigger.type === "positive"
                          ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-950 dark:border-emerald-900"
                          : "bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800"
                      }`}
                    >
                      <p className={`text-sm font-medium ${
                        trigger.type === "negative" ? "text-red-700 dark:text-red-400" 
                        : trigger.type === "positive" ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-400"
                      }`}>
                        {trigger.name}
                      </p>
                      <p className={`text-xs mt-1 ${
                        trigger.type === "negative" ? "text-red-600 dark:text-red-500" 
                        : trigger.type === "positive" ? "text-emerald-600 dark:text-emerald-500"
                        : "text-slate-600 dark:text-slate-500"
                      }`}>
                        Mentioned in {trigger.count} {trigger.count === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state for new users */}
          {moodEntries.length === 0 && journalEntries.length === 0 && (
            <Card variant="sage" className="text-center py-8">
              <CardContent>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No data yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start logging your mood and writing journal entries to see insights here.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      <WellnessChat />
    </div>
  );
}
