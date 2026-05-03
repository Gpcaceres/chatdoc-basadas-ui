import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "flex gap-4 max-w-[85%] md:max-w-[75%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={clsx(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1",
            isUser
              ? "bg-teal-600 shadow-teal-500/20 text-white"
              : "bg-bg-hover border border-border-color text-text-muted"
          )}
        >
          {isUser ? <User size={15} /> : <Bot size={15} />}
        </div>

        {/* Burbuja */}
        <div
          className={clsx(
            "px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm relative",
            isUser
              ? "bg-teal-600 text-white rounded-tr-sm shadow-teal-900/10"
              : "bg-card text-text-main rounded-tl-sm border border-border-color"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed text-text-main">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-text-main">{children}</strong>
                ),
                em: ({ children }) => <em className="italic text-text-muted">{children}</em>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-bg-hover text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-border-color">
                      {children}
                    </code>
                  ) : (
                    <code className="text-[13px] font-mono">{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-background border border-border-color rounded-xl p-4 my-4 overflow-x-auto text-[13px] font-mono text-text-main shadow-inner">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-3 space-y-1 marker:text-text-muted">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-3 space-y-1 marker:text-text-muted">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="pl-1">{children}</li>,
                a: ({ children, href }) => (
                  <a href={href} className="text-teal-600 dark:text-teal-400 hover:opacity-80 underline underline-offset-2 transition-colors">
                    {children}
                  </a>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
