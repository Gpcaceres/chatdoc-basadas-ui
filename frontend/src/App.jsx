import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chatKey, setChatKey] = useState(0);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or default to dark
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true; // Default dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleNewChat = () => {
    setChatKey((k) => k + 1);
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex h-screen overflow-hidden text-text-main bg-background p-2 gap-2 transition-colors duration-300">
      {/* Panel Izquierdo: Fuentes / Base de Conocimiento */}
      <div className="w-[340px] flex-shrink-0 flex flex-col panel-container relative overflow-hidden transition-colors duration-300">
        <Sidebar
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          onNewChat={handleNewChat}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Panel Derecho: Chat */}
      <main className="flex-1 flex flex-col panel-container relative overflow-hidden transition-colors duration-300">
        <ChatWindow key={chatKey} />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "text-sm",
          style: {
            background: "var(--bg-panel)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle)"
          },
          duration: 3000,
        }}
      />
    </div>
  );
}
