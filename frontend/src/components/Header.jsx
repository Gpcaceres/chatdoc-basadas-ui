import { Menu, Bot } from "lucide-react";

export default function Header({ sidebarOpen, onToggleSidebar }) {
  return (
    <header className="flex items-center h-14 px-4 bg-white border-b border-slate-200 shadow-sm z-20 flex-shrink-0">
      {/* Botón hamburguesa */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors mr-3"
        title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <Menu size={20} />
      </button>

      {/* Logo + Título */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-800 leading-tight">
            ChatBot IA
          </h1>
          <p className="text-xs text-slate-400 leading-tight">
            Asistente Documental
          </p>
        </div>
      </div>

      {/* Badge derecho */}
      <div className="ml-auto">
        <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          LlamaIndex + Groq
        </span>
      </div>
    </header>
  );
}
