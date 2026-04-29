import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        {isUser ? (
          <User size={15} className="text-white" />
        ) : (
          <Bot size={15} className="text-white" />
        )}
      </div>

      {/* Burbuja */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm shadow-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-1.5 last:mb-0">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-slate-100 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-1.5 space-y-0.5">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 mb-1.5 space-y-0.5">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
