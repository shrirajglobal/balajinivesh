import { useMemo } from "react";
import { marked } from "marked";

interface MarkdownProps {
  content: string;
  className?: string;
}

marked.setOptions({ breaks: true, gfm: true });

const Markdown = ({ content, className }: MarkdownProps) => {
  const html = useMemo(() => marked.parse(content) as string, [content]);
  return (
    <div
      className={
        className ??
        "prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground/90 prose-blockquote:text-muted-foreground prose-code:text-primary"
      }
      // marked output is sanitized when produced from our trusted backend & admin editor;
      // for user-submitted content we'd add DOMPurify. Blog posts go through admin review.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Markdown;
