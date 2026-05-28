import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Check, X, Shuffle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
}

const MiniCheck = ({ questions }: { questions: Question[] }) => {
  const [seed, setSeed] = useState(0);
  const q = useMemo(() => questions[Math.floor(Math.random() * questions.length)], [questions, seed]);
  const [picked, setPicked] = useState<number | null>(null);

  if (!q) return null;

  const reset = () => { setPicked(null); setSeed((s) => s + 1); };

  return (
    <Card className="border-secondary/30 bg-secondary/5">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-secondary">
            <Brain className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Quick self-check</span>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs">
            <Shuffle className="h-3 w-3" /> New question
          </Button>
        </div>
        <p className="font-medium text-foreground">{q.question}</p>
        <div className="mt-3 grid gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct_index;
            const isPicked = picked === i;
            const show = picked !== null;
            return (
              <button
                key={i}
                disabled={show}
                onClick={() => setPicked(i)}
                className={`flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all ${
                  !show ? "border-border bg-card hover:border-secondary/50 hover:bg-secondary/5"
                  : isCorrect ? "border-emerald-500/50 bg-emerald-500/10"
                  : isPicked ? "border-destructive/50 bg-destructive/10"
                  : "border-border bg-card opacity-60"
                }`}
              >
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  show && isCorrect ? "border-emerald-500 bg-emerald-500 text-white"
                  : show && isPicked ? "border-destructive bg-destructive text-white"
                  : "border-muted-foreground/40 text-muted-foreground"
                }`}>
                  {show && isCorrect ? <Check className="h-3 w-3" /> : show && isPicked ? <X className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="text-foreground/90">{opt}</span>
              </button>
            );
          })}
        </div>
        {picked !== null && q.explanation && (
          <div className="mt-3 rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-sm text-foreground/90">
            <span className="font-semibold text-secondary">Why: </span>{q.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniCheck;
