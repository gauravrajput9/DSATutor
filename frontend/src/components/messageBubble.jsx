import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, Check, Copy, User } from "lucide-react";
import { toast } from "sonner";

const MarkdownParagraph = ({ children }) => (
  <p className="mb-4 text-[15px] leading-7 text-slate-300 last:mb-0">{children}</p>
);

export default function MessageBubble({ role, text, loading = false }) {
  const isUser = role === "user";

  const copyToClipboard = async (value, label = "Copied to clipboard.") => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(label);
    } catch {
      toast.error("Clipboard access failed.");
    }
  };

  if (isUser) {
    return (
      <section className="ml-auto flex w-full max-w-3xl justify-end">
        <div className="w-full rounded-[28px] border border-sky-300/18 bg-sky-400/[0.08] px-5 py-4 text-slate-100 shadow-lg shadow-sky-950/10">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-sky-200/75">
            <User size={14} />
            You
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-100">
            {text}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
          <Bot size={14} />
          DSA Bot
        </div>

        {!!text?.trim() && (
          <button
            type="button"
            onClick={() => copyToClipboard(text, "Response copied.")}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Copy size={14} />
            Copy answer
          </button>
        )}
      </div>

      <article className="assistant-response rounded-[30px] border border-white/8 bg-slate-950/25 px-5 py-5 shadow-xl shadow-slate-950/20 sm:px-7 sm:py-6">
        {loading && !text?.trim() ? (
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded-full bg-white/8" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/6" />
            <div className="h-4 w-[92%] animate-pulse rounded-full bg-white/6" />
            <div className="h-4 w-[74%] animate-pulse rounded-full bg-white/6" />
          </div>
        ) : (
          <div className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-4 mt-2 text-3xl font-semibold tracking-tight text-white">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-4 mt-8 border-t border-white/8 pt-6 text-2xl font-semibold tracking-tight text-white first:mt-0 first:border-t-0 first:pt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-6 text-xl font-semibold text-sky-100">
                    {children}
                  </h3>
                ),
                p: MarkdownParagraph,
                ul: ({ children }) => (
                  <ul className="mb-5 space-y-3 text-slate-300">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-5 list-decimal space-y-3 pl-6 text-slate-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex gap-3 leading-7">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-300" />
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                hr: () => <div className="my-6 h-px bg-white/8" />,
                blockquote: ({ children }) => (
                  <blockquote className="my-5 rounded-r-2xl border-l-4 border-sky-300/60 bg-sky-300/6 px-4 py-3 text-slate-200">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
                    <table className="w-full border-collapse text-left text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-white/6 text-slate-200">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border-b border-white/8 px-4 py-3 font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-b border-white/8 px-4 py-3 text-slate-300">
                    {children}
                  </td>
                ),
                code({ inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  if (inline) {
                    return (
                      <code className="rounded-md bg-white/8 px-1.5 py-0.5 text-sm text-sky-200">
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="my-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1220]">
                      <div className="flex items-center justify-between border-b border-white/8 bg-[#0f1729] px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                        <span>{match ? match[1] : "code"}</span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(codeString, "Code copied.")
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] tracking-[0.16em] text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <Copy size={13} />
                          Copy
                        </button>
                      </div>

                      <SyntaxHighlighter
                        language={match ? match[1] : "javascript"}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          padding: "20px",
                          background: "transparent",
                          fontSize: "13px",
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>

            {!loading && !!text?.trim() && (
              <div className="mt-6 flex items-center gap-2 border-t border-white/8 pt-4 text-xs uppercase tracking-[0.22em] text-slate-500">
                <Check size={14} />
                Response formatted for easier reading
              </div>
            )}
          </div>
        )}
      </article>
    </section>
  );
}
