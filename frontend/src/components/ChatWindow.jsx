import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { sendMessage } from "../api/api";
import MessageBubble from "./MessageBubble";

const WELCOME = {
  role: "assistant",
  content:
    "¡Hola! Soy tu **asistente documental**. Carga un documento desde el menú lateral y luego hazme preguntas sobre su contenido. ¿En qué puedo ayudarte?",
};

export default function ChatWindow() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(text);
      setMessages([
        ...updated,
        { role: "assistant", content: res.data.respuesta },
      ]);
    } catch {
      toast.error("Error al conectar con el servidor");
      setMessages([
        ...updated,
        {
          role: "assistant",
          content:
            "Lo siento, hubo un problema al procesar tu consulta. Verifica que el servidor esté activo en `http://localhost:8000`.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Indicador "escribiendo" */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">IA</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Barra de entrada */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            rows={2}
            className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Escribe tu pregunta… (Enter para enviar · Shift+Enter para nueva línea)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            title="Enviar mensaje"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
