import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface ProgressTrackerProps {
  completed: string[];
  total: number;
  segment: string;
}

const ProgressTracker = ({ completed, total, segment }: ProgressTrackerProps) => {
  const percentage = Math.round((completed.length / total) * 100);
  const allDone = completed.length === total;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {allDone ? "🎉 All topics completed!" : `${completed.length} of ${total} topics completed`}
        </span>
        <span className="text-sm font-bold text-primary">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-3" />
      {allDone && (
        <p className="mt-2 text-sm text-brand-green font-medium flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" /> You've earned your certificate!
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;
