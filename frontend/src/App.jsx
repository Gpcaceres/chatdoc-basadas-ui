import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import FileUpload from "./components/FileUpload";

export default function App() {
  const [view, setView] = useState("chat"); // 'chat' | 'upload'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatKey, setChatKey] = useState(0); // forzar reset del chat

  const handleNewChat = () => {
    setChatKey((k) => k + 1);
    setView("chat");
  };

  const handleUploadDone = () => {
    setChatKey((k) => k + 1);
    setView("chat");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          view={view}
          onNewChat={handleNewChat}
          onUpload={() => setView("upload")}
        />

        <main className="flex-1 overflow-hidden">
          {view === "chat" ? (
            <ChatWindow key={chatKey} />
          ) : (
            <FileUpload onDone={handleUploadDone} />
          )}
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{ className: "text-sm", duration: 3000 }}
      />
    </div>
  );
}
