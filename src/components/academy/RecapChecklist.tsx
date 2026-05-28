import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const RecapChecklist = ({ items, storageKey }: { items: string[]; storageKey: string }) => {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(new Set(JSON.parse(raw)));
    } catch {}
  }, [storageKey]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  return (
    <ul className="space-y-2">
      {items.map((r, i) => {
        const on = checked.has(i);
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className={`group flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                on ? "border-emerald-500/40 bg-emerald-500/10" : "border-border bg-card hover:border-emerald-500/30 hover:bg-emerald-500/5"
              }`}
            >
              {on ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-emerald-600" />}
              <span className={on ? "text-foreground" : "text-foreground/90"}>{r}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default RecapChecklist;
