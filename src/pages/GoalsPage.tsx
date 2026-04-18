import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Flame } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoalCard } from "@/components/goals/GoalCard";
import { AIInsight } from "@/components/coach/AIInsight";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  streak: number;
  completedToday: boolean;
}

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Morning Meditation",
    description: "10 minutes of mindful meditation",
    progress: 85,
    streak: 7,
    completedToday: true,
  },
  {
    id: 2,
    title: "Sleep by 11 PM",
    description: "Get enough rest for better mental health",
    progress: 60,
    streak: 3,
    completedToday: false,
  },
  {
    id: 3,
    title: "Daily Gratitude",
    description: "Write 3 things I'm grateful for",
    progress: 100,
    streak: 14,
    completedToday: true,
  },
  {
    id: 4,
    title: "Exercise",
    description: "30 minutes of physical activity",
    progress: 40,
    streak: 0,
    completedToday: false,
  },
];

export default function GoalsPage() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", description: "" });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleToggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completedToday: !goal.completedToday,
              streak: !goal.completedToday ? goal.streak + 1 : Math.max(0, goal.streak - 1),
            }
          : goal
      )
    );

    const goal = goals.find((g) => g.id === id);
    if (goal && !goal.completedToday) {
      toast({
        title: "Great job! 🎉",
        description: `You completed "${goal.title}" today!`,
      });
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      streak: 0,
      completedToday: false,
    };

    setGoals((prev) => [...prev, goal]);
    setNewGoal({ title: "", description: "" });
    setIsDialogOpen(false);

    toast({
      title: "Goal created! 🎯",
      description: "Start tracking your new habit today.",
    });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingGoal || !editingGoal.title.trim()) return;

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === editingGoal.id
          ? { ...goal, title: editingGoal.title, description: editingGoal.description }
          : goal
      )
    );

    setIsEditDialogOpen(false);
    setEditingGoal(null);

    toast({
      title: "Goal updated!",
      description: "Your changes have been saved.",
    });
  };

  const completedToday = goals.filter((g) => g.completedToday).length;
  const totalGoals = goals.length;
  const longestStreak = Math.max(...goals.map((g) => g.streak));

  const handleLogout = () => {
    // TODO: Implement logout
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Goals</h1>
              <p className="text-muted-foreground">Build healthy habits for your wellbeing</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Morning Meditation"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      placeholder="e.g., 10 minutes every morning"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddGoal} variant="hero" className="w-full">
                    Create Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card variant="sage">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {completedToday}/{totalGoals}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Today</p>
              </CardContent>
            </Card>
            <Card variant="warm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-coral">
                  <Flame className="w-5 h-5" />
                  {longestStreak}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Best Streak</p>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round((completedToday / totalGoals) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Completion</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Insight */}
          <AIInsight
            title="Habit Coach"
            message="You're doing great with your Daily Gratitude habit - 14 days strong! Try linking your Exercise goal to an existing habit for better consistency."
            suggestion="Do 5 jumping jacks right after your morning meditation."
          />

          {/* Goals List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Your Goals</h2>
            </div>
            <div className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  title={goal.title}
                  description={goal.description}
                  progress={goal.progress}
                  streak={goal.streak}
                  completedToday={goal.completedToday}
                  onToggle={() => handleToggleGoal(goal.id)}
                  onEdit={() => handleEditGoal(goal)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Goal Title</Label>
              <Input
                id="edit-title"
                placeholder="e.g., Morning Meditation"
                value={editingGoal?.title || ""}
                onChange={(e) =>
                  setEditingGoal((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Input
                id="edit-description"
                placeholder="e.g., 10 minutes every morning"
                value={editingGoal?.description || ""}
                onChange={(e) =>
                  setEditingGoal((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
              />
            </div>
            <Button onClick={handleSaveEdit} variant="hero" className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
