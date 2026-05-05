import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Send, Sparkles } from "lucide-react";
import { sendMessage } from "../api/api";
import MessageBubble from "./MessageBubble";
import { motion } from "framer-motion";

const WELCOME = {
  role: "assistant",
  content:
    "¡Hola! Soy tu **asistente documental** impulsado por IA.\n\nCarga tus documentos en la sección de fuentes (a la izquierda) y pregúntame lo que necesites saber. Analizaré la información y te daré respuestas precisas.",
};

export default function ChatWindow({ uploadedFiles = [] }) {
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
      const selectedFiles = uploadedFiles.filter(f => f.selected && f.ok).map(f => f.name);
      const res = await sendMessage(text, selectedFiles);
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
            "Lo siento, hubo un problema de conexión. Por favor, asegúrate de que tu backend está corriendo y tu clave API es correcta.",
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
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-custom pb-32">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {messages.map((msg, i) => (
             <MessageBubble key={i} message={msg} />
          ))}

          {/* Indicador "escribiendo" */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-start"
            >
              <div className="flex gap-4 max-w-[85%] md:max-w-[75%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-bg-hover border border-border-color mt-1">
                  <Sparkles size={14} className="text-text-muted animate-pulse" />
                </div>
                <div className="bg-card border border-border-color px-5 py-4 rounded-3xl rounded-tl-sm text-text-main shadow-sm">
                  <div className="flex gap-1.5 items-center h-5">
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 bg-text-muted rounded-full"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-text-muted rounded-full"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-text-muted rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Barra de entrada flotante */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-panel via-panel/90 to-transparent pointer-events-none transition-colors duration-300">
        <div className="max-w-3xl mx-auto relative pointer-events-auto">
          <div className="bg-card p-2 rounded-2xl flex items-end gap-2 shadow-xl ring-1 ring-border-color transition-all focus-within:ring-teal-500/50">
            <textarea
              rows={1}
              className="flex-1 resize-none bg-transparent px-4 py-3 text-[15px] text-text-main placeholder-text-muted focus:outline-none max-h-32 min-h-[44px] overflow-y-auto scrollbar-custom leading-relaxed"
              placeholder="Pregunta sobre tus documentos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ height: "auto" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-3 mb-0.5 mr-0.5 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:bg-bg-hover disabled:text-text-muted transition-all flex-shrink-0 shadow-md shadow-teal-600/20 disabled:shadow-none"
              title="Enviar mensaje"
            >
              <Send size={18} className={!input.trim() || loading ? "" : "translate-x-0.5 -translate-y-0.5 transition-transform"} />
            </button>
          </div>
          <p className="text-center text-[10px] text-text-muted mt-3 tracking-wide">
            La IA puede cometer errores. Verifica la información importante en los documentos originales.
          </p>
        </div>
      </div>
    </div>
  );
}
