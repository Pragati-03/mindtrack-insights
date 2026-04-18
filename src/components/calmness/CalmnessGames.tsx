import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Brain, Heart } from "lucide-react";
import { BreathingBubble } from "./BreathingBubble";
import { ReflectionQuiz } from "./ReflectionQuiz";
import { GratitudeListing } from "./GratitudeListing";

export const CalmnessGames = () => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">🧘</span>
          Calmness Corner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Take 1-2 minutes for a calming activity
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breathing" className="gap-1 text-xs sm:text-sm">
              <Wind className="h-4 w-4" />
              <span className="hidden sm:inline">Breathe</span>
            </TabsTrigger>
            <TabsTrigger value="reflect" className="gap-1 text-xs sm:text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Reflect</span>
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="gap-1 text-xs sm:text-sm">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Gratitude</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="breathing" className="mt-4">
            <BreathingBubble />
          </TabsContent>
          <TabsContent value="reflect" className="mt-4">
            <ReflectionQuiz />
          </TabsContent>
          <TabsContent value="gratitude" className="mt-4">
            <GratitudeListing />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
