import { useEffect, useState } from "react";
import { fakeApi, AITip } from "@/lib/fakeApi";
import { cn } from "@/lib/utils";
import {
  Brain,
  TrendingUp,
  Repeat,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const getIconForType = (type: AITip["type"]) => {
  switch (type) {
    case "restock":
      return TrendingUp;
    case "swap":
      return Repeat;
    case "forecast":
      return Brain;
    case "alert":
      return AlertTriangle;
    default:
      return Brain;
  }
};

const getColorForUrgency = (urgency: AITip["urgency"]) => {
  switch (urgency) {
    case "high":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "low":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};

export default function AITipsCarousel() {
  const [aiTips, setAITips] = useState<AITip[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const tips = await fakeApi.getAITips();
        setAITips(tips);
      } catch (error) {
        console.error("Error fetching AI tips:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch AI tips",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();

    // Poll for new tips every 2 seconds
    const interval = setInterval(fetchTips, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (aiTips.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiTips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [aiTips.length]);

  if (error) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold">AI Insights Error</h2>
        </div>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (aiTips.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
        </div>
        <p className="text-muted-foreground">
          AI is analyzing your inventory patterns...
        </p>
      </div>
    );
  }

  const currentTip = aiTips[currentIndex];
  const Icon = getIconForType(currentTip.type);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
        </div>
        <div className="flex items-center space-x-1">
          {aiTips.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                index === currentIndex ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div
          className={cn(
            "rounded-xl border-2 p-4 min-h-[120px] flex items-center",
            "transition-all duration-500 ease-in-out",
            getColorForUrgency(currentTip.urgency),
          )}
          style={{
            transition:
              "background-color 0.5s ease-in-out, border-color 0.5s ease-in-out, color 0.5s ease-in-out",
          }}
        >
          <div className="flex items-start space-x-3 w-full">
            <div className="flex-shrink-0 mt-0.5">
              <Icon className="h-5 w-5 transition-all duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium leading-tight transition-all duration-300">
                {currentTip.message}
              </p>
              {currentTip.product && (
                <p className="text-sm opacity-75 mt-1 transition-all duration-300">
                  Product: {currentTip.product}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium uppercase tracking-wide transition-all duration-300">
                  {currentTip.type}
                </span>
                <span className="text-xs opacity-75 transition-all duration-300">
                  {currentTip.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 opacity-50 transition-all duration-300 mt-0.5" />
          </div>
        </div>

        {aiTips.length > 1 && (
          <div className="flex justify-center gap-2 flex-wrap">
            {aiTips.slice(0, 3).map((tip, index) => {
              if (index === currentIndex) return null;
              const TipIcon = getIconForType(tip.type);
              return (
                <button
                  key={tip.id}
                  onClick={() => setCurrentIndex(index)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs flex-1 min-w-0 max-w-[120px]"
                >
                  <TipIcon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {tip.message.split(" ").slice(0, 2).join(" ")}...
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
