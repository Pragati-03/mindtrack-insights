import { motion } from "framer-motion";
import { 
  BookOpen, BarChart3, Target, MessageCircle, Brain, 
  TrendingUp, Shield, Sparkles, Bell, Download, CheckCircle
} from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WellnessChat } from "@/components/chat/WellnessChat";

const features = [
  {
    icon: BookOpen,
    title: "Daily Journaling",
    description: "Express your thoughts and track your daily mood with our intuitive journaling interface.",
    status: "available",
    path: "/journal"
  },
  {
    icon: Brain,
    title: "AI Sentiment Analysis",
    description: "Our AI analyzes your entries to detect emotions, stress levels, and patterns.",
    status: "available",
    path: "/dashboard"
  },
  {
    icon: MessageCircle,
    title: "Wellness Coach Chatbot",
    description: "Get personalized advice and coping strategies from our AI wellness coach.",
    status: "available",
    path: null
  },
  {
    icon: BarChart3,
    title: "Mood Analytics",
    description: "Visualize your emotional trends with beautiful charts and insights.",
    status: "available",
    path: "/dashboard"
  },
  {
    icon: Target,
    title: "Goals & Habits",
    description: "Set wellness goals and track your progress with streak counters.",
    status: "available",
    path: "/goals"
  },
  {
    icon: TrendingUp,
    title: "Trigger Detection",
    description: "Identify patterns and triggers that affect your mental wellbeing.",
    status: "available",
    path: "/dashboard"
  },
  {
    icon: Download,
    title: "Data Export",
    description: "Export your journal entries and mood data as PDF reports.",
    status: "available",
    path: "/profile"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and secure. Only you can access your entries.",
    status: "available",
    path: null
  },
  {
    icon: Bell,
    title: "Daily Reminders",
    description: "Get gentle notifications to journal and check in with yourself.",
    status: "coming-soon",
    path: null
  },
  {
    icon: Sparkles,
    title: "Weekly Reflections",
    description: "AI-generated summaries and insights from your weekly entries.",
    status: "coming-soon",
    path: null
  },
];

export default function FeaturesPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 pt-24 pb-32 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              MindTrack Features
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for your mental wellness journey, all in one place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant="glass" 
                  className={feature.path ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}
                  onClick={() => feature.path && navigate(feature.path)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge 
                        variant={feature.status === "available" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {feature.status === "available" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Available
                          </span>
                        ) : (
                          "Coming Soon"
                        )}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {isAuthenticated && <WellnessChat />}
    </div>
  );
}
