import { MessageSquarePlus, UploadCloud } from "lucide-react";

export default function Sidebar({ open, view, onNewChat, onUpload }) {
  return (
    <aside
      className={`bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${
        open ? "w-64" : "w-0"
      }`}
    >
      {/* Contenido interior — min-w fijo para que no se deforme al contraer */}
      <div className="flex flex-col flex-1 p-3 gap-1 w-64">
        {/* Sección: Chat */}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 pt-3 pb-2">
          Chat
        </p>

        <button
          onClick={onNewChat}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            view === "chat"
              ? "bg-blue-600 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <MessageSquarePlus size={17} />
          Nuevo Chat
        </button>

        <div className="border-t border-slate-700/50 my-2 mx-1" />

        {/* Sección: Documentos */}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 pb-2">
          Documentos
        </p>

        <button
          onClick={onUpload}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            view === "upload"
              ? "bg-blue-600 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <UploadCloud size={17} />
          Cargar Documentos
        </button>
      </div>

      {/* Footer de la barra */}
      <div className="p-4 border-t border-slate-700/50 w-64">
        <p className="text-xs text-slate-500 text-center">© 2026 ChatBot IA</p>
      </div>
    </aside>
  );
}
