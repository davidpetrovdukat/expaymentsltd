import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
    content: string;
}

/** Legal-document typography: Word-like hierarchy, clear headings, readable lists. */
const proseClasses = {
    h2: 'text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-14 mb-4 first:mt-0 pb-1 border-b border-slate-200 dark:border-slate-700',
    h3: 'text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-3',
    h4: 'text-base md:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2',
    p: 'text-slate-700 dark:text-slate-300 leading-[1.65] mb-4 max-w-none',
    ul: 'list-disc pl-6 my-5 space-y-2 text-slate-700 dark:text-slate-300',
    ol: 'list-decimal pl-6 my-5 space-y-2 text-slate-700 dark:text-slate-300',
    li: 'leading-[1.65] pl-1',
    strong: 'font-semibold text-slate-900 dark:text-white',
};

/**
 * Renders markdown string with Tailwind typography. Supports lists, links, tables (remark-gfm). Server-safe.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h2: ({ children }) => <h2 className={proseClasses.h2}>{children}</h2>,
                h3: ({ children }) => <h3 className={proseClasses.h3}>{children}</h3>,
                h4: ({ children }) => <h4 className={proseClasses.h4}>{children}</h4>,
                p: ({ children }) => <p className={proseClasses.p}>{children}</p>,
                ul: ({ children }) => <ul className={proseClasses.ul}>{children}</ul>,
                ol: ({ children }) => <ol className={proseClasses.ol}>{children}</ol>,
                li: ({ children }) => <li className={proseClasses.li}>{children}</li>,
                strong: ({ children }) => <strong className={proseClasses.strong}>{children}</strong>,
                a: ({ href, children }) => (
                    <a href={href} className="text-primary hover:underline font-medium">
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
