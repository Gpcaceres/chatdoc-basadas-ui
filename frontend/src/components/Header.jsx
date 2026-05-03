import { Menu, X, Sparkles } from "lucide-react";

export default function Header({ sidebarOpen, onToggleSidebar }) {
  return (
    <header className="h-16 flex-shrink-0 glass flex items-center px-4 justify-between z-20 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            ChatDoc AI
          </h1>
        </div>
      </div>

      {/* Placeholder for future user profile or actions */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
          U
        </div>
      </div>
    </header>
  );
}
