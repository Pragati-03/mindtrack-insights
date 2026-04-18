import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  BarChart3, 
  Target, 
  Sparkles, 
  Heart, 
  Shield,
  Brain,
  Bell,
  TrendingUp,
  Smile,
  PenLine,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/layout/Navigation";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Mood Journaling",
    description: "Express your thoughts and feelings daily with our intuitive journaling experience.",
    color: "bg-sage-light text-primary",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Get personalized insights powered by AI that understand your emotional patterns.",
    color: "bg-peach text-peach-dark",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Track your mood trends and identify triggers with beautiful visualizations.",
    color: "bg-lavender text-violet-600",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set wellness goals and build healthy habits with streak tracking.",
    color: "bg-sky text-blue-600",
  },
];

const detailedFeatures = [
  {
    icon: PenLine,
    title: "Daily Journaling",
    description: "Write about your day, tag entries, and track your emotional journey over time.",
  },
  {
    icon: Brain,
    title: "NLP Analysis",
    description: "Advanced sentiment analysis detects emotions, stress levels, and mood triggers.",
  },
  {
    icon: Smile,
    title: "Mood Tracking",
    description: "Use emoji pickers or sliders to quickly log how you're feeling throughout the day.",
  },
  {
    icon: TrendingUp,
    title: "Trend Insights",
    description: "See weekly and monthly patterns to understand what affects your mental state.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Gentle notifications remind you to check in and maintain your journaling habit.",
  },
  {
    icon: Clock,
    title: "Habit Streaks",
    description: "Build consistency with streak counters and celebrate your wellness milestones.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={false} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-primary text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4" />
              Your mental wellness companion
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Understand Your Mind,{" "}
              <span className="text-primary">Transform Your Life</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              MindTrack helps you journal your emotions, discover patterns, and receive 
              personalized insights to improve your mental well-being every day.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help you understand, track, and improve your emotional health.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card variant="elevated" className="h-full hover:shadow-large transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover all the tools that make MindTrack your perfect wellness companion.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {detailedFeatures.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card variant="glass" className="h-full hover:shadow-medium transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card variant="sage" className="overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Your Privacy is Our Priority
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Your journal entries and personal data are encrypted and secure. 
                  We never share your information with third parties.
                </p>
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="lg" className="gap-2">
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-foreground">MindTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MindTrack. Your journey to mental wellness starts here.
          </p>
        </div>
      </footer>
    </div>
  );
}
