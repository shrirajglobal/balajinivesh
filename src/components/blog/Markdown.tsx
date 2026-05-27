import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkdownProps {
  content: string;
  className?: string;
}

marked.setOptions({ breaks: true, gfm: true });

const Markdown = ({ content, className }: MarkdownProps) => {
  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(content) as string),
    [content]
  );
  return (
    <div
      className={
        className ??
        "prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground/90 prose-blockquote:text-muted-foreground prose-code:text-primary"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Markdown;
