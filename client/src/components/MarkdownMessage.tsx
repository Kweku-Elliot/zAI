import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

export function MarkdownMessage({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        code(props) {
          const {inline, className, children, ...rest} = props as any;
          return !inline ? (
            <pre className={className} {...rest}><code>{children}</code></pre>
          ) : (
            <code className={className} {...rest}>{children}</code>
          );
        },
        a(props) {
          return <a {...props} target="_blank" rel="noopener noreferrer" />;
        }
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
