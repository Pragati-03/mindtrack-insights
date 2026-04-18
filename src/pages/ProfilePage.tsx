import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Bell, Shield, LogOut, ChevronRight, Download, FileText } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import jsPDF from "jspdf";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    stressAlerts: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfile({
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
          email: session.user.email || "",
        });
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setProfile({
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
          email: session.user.email || "",
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated! ✨",
      description: "Your changes have been saved.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleExportPDF = async () => {
    if (!user) return;
    
    setExporting(true);
    
    try {
      // Fetch mood entries
      const { data: moodEntries, error: moodError } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (moodError) throw moodError;

      // Fetch journal entries
      const { data: journalEntries, error: journalError } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (journalError) throw journalError;

      // Create PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(76, 115, 89); // Primary green color
      pdf.text("MindTrack", pageWidth / 2, 20, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Your Wellness Data Export", pageWidth / 2, 30, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 38, { align: "center" });
      
      // User Info Section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Profile Information", 20, 55);
      
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Name: ${profile.name}`, 20, 65);
      pdf.text(`Email: ${profile.email}`, 20, 73);
      pdf.text(`Member since: ${user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}`, 20, 81);
      
      // Mood Entries Section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Mood History", 20, 100);
      
      if (moodEntries && moodEntries.length > 0) {
        let yPos = 112;
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Date", 20, yPos);
        pdf.text("Mood Score", 80, yPos);
        pdf.text("Mood Level", 130, yPos);
        
        yPos += 8;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPos, 190, yPos);
        yPos += 6;
        
        pdf.setTextColor(60, 60, 60);
        
        const getMoodLabel = (score: number) => {
          if (score <= 12) return "Very Low 😢";
          if (score <= 37) return "Low 😔";
          if (score <= 62) return "Okay 😐";
          if (score <= 87) return "Good 🙂";
          return "Great 😊";
        };

        for (const entry of moodEntries.slice(0, 30)) { // Limit to 30 entries per page
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          
          const date = new Date(entry.created_at).toLocaleDateString();
          pdf.text(date, 20, yPos);
          pdf.text(String(entry.mood_score), 80, yPos);
          pdf.text(getMoodLabel(entry.mood_score), 130, yPos);
          yPos += 8;
        }
        
        // Summary
        yPos += 10;
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }
        
        const avgMood = moodEntries.reduce((sum, e) => sum + e.mood_score, 0) / moodEntries.length;
        
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Summary", 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(11);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`Total Mood Entries: ${moodEntries.length}`, 20, yPos);
        yPos += 8;
        pdf.text(`Average Mood Score: ${avgMood.toFixed(1)}`, 20, yPos);
        yPos += 8;
        pdf.text(`Average Mood Level: ${getMoodLabel(avgMood)}`, 20, yPos);
      } else {
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        pdf.text("No mood entries recorded yet.", 20, 112);
      }

      // Journal Entries Section
      pdf.addPage();
      let journalYPos = 20;
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Journal History", 20, journalYPos);
      journalYPos += 15;

      if (journalEntries && journalEntries.length > 0) {
        for (const entry of journalEntries) {
          if (journalYPos > 250) {
            pdf.addPage();
            journalYPos = 20;
          }

          // Date and mood
          pdf.setFontSize(11);
          pdf.setTextColor(76, 115, 89);
          const entryDate = new Date(entry.created_at).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          pdf.text(`${entryDate} - Mood: ${entry.mood}`, 20, journalYPos);
          journalYPos += 6;

          // Content (truncate if too long)
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          const contentLines = pdf.splitTextToSize(entry.content, 170);
          const linesToShow = contentLines.slice(0, 4);
          for (const line of linesToShow) {
            if (journalYPos > 280) {
              pdf.addPage();
              journalYPos = 20;
            }
            pdf.text(line, 20, journalYPos);
            journalYPos += 5;
          }
          if (contentLines.length > 4) {
            pdf.text("...", 20, journalYPos);
            journalYPos += 5;
          }

          // Tags
          if (entry.tags && entry.tags.length > 0) {
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Tags: ${entry.tags.join(", ")}`, 20, journalYPos);
            journalYPos += 5;
          }

          journalYPos += 8;
        }
      } else {
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        pdf.text("No journal entries recorded yet.", 20, journalYPos);
      }
      
      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${pageCount} | MindTrack - Your Mental Wellness Companion`,
          pageWidth / 2,
          290,
          { align: "center" }
        );
      }
      
      // Download
      pdf.save(`mindtrack-export-${new Date().toISOString().split("T")[0]}.pdf`);
      
      toast({
        title: "Export successful!",
        description: "Your data has been downloaded as PDF.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Profile Card */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {profile.name.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{profile.name || "User"}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <p className="text-sm text-primary mt-1">
                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled
                />
              </div>
              <Button variant="hero" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Daily Journal Reminder</p>
                  <p className="text-sm text-muted-foreground">Get reminded to write daily</p>
                </div>
                <Switch
                  checked={notifications.dailyReminder}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, dailyReminder: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Report</p>
                  <p className="text-sm text-muted-foreground">Receive weekly mood insights</p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReport: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Stress Alerts</p>
                  <p className="text-sm text-muted-foreground">Alert when stress is high</p>
                </div>
                <Switch
                  checked={notifications.stressAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, stressAlerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <span className="font-medium text-foreground block">Export My Data</span>
                    <span className="text-sm text-muted-foreground">Download as PDF</span>
                  </div>
                </div>
                {exporting ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">Delete Account</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
