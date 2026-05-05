import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { MessageSquarePlus, FileText, Plus, CheckCircle, XCircle, X, Sparkles, FolderOpen, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { uploadDocument } from "../api/api";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
};

export default function Sidebar({ uploadedFiles, setUploadedFiles, onNewChat, isDark, toggleTheme }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length || uploading) return;
    setUploading(true);

    const newFiles = [];
    for (const file of acceptedFiles) {
      try {
        await uploadDocument(file);
        newFiles.push({ name: file.name, ok: true, selected: false });
        toast.success(`"${file.name}" analizado`, { icon: '✨' });
      } catch {
        newFiles.push({ name: file.name, ok: false, selected: false });
        toast.error(`Error al procesar "${file.name}"`);
      }
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setUploading(false);
  }, [uploading, setUploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
  });

  const toggleSelection = (index) => {
    setUploadedFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, selected: !f.selected } : f
    ));
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Branding & Theme Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-border-color">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <Sparkles size={14} className="text-white" />
          </div>
          <h1 className="text-base font-semibold tracking-tight text-text-main">
            ChatDoc AI
          </h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 text-text-muted hover:text-text-main hover:bg-bg-hover rounded-xl transition-colors focus:outline-none"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto scrollbar-custom">
        {/* Nueva Conversación */}
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-bg-hover hover:bg-black/10 dark:hover:bg-white/10 text-text-main border border-border-color"
        >
          <MessageSquarePlus size={16} />
          Nuevo Chat
        </button>

        <div className="w-full h-px bg-border-color my-2" />

        {/* Fuentes */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Fuentes ({uploadedFiles.length})
          </p>
        </div>

        {/* Lista de Fuentes */}
        <div className="space-y-2">
          <AnimatePresence>
            {uploadedFiles.map((f, i) => (
              <motion.div
                key={`${f.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors",
                  f.ok ? (f.selected ? "bg-teal-500/10 border-teal-500/30" : "bg-bg-hover border-border-color hover:border-text-muted") : "bg-red-500/5 border-red-500/20"
                )}
              >
                {f.ok && (
                  <div className="flex-shrink-0 flex items-center">
                    <input
                      type="checkbox"
                      checked={f.selected || false}
                      onChange={() => toggleSelection(i)}
                      className="w-4 h-4 rounded border-border-color text-teal-600 focus:ring-teal-500/50 bg-transparent cursor-pointer"
                      title="Seleccionar para analizar (si ninguno está seleccionado se analizarán todos)"
                    />
                  </div>
                )}
                <div className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  f.ok ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}>
                  {f.ok ? <FileText size={14} /> : <XCircle size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-main truncate">
                    {f.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {uploadedFiles.length === 0 && (
            <div className="text-center py-6 px-4 bg-bg-hover border border-border-color rounded-xl border-dashed">
              <FolderOpen size={24} className="mx-auto text-text-muted mb-2 opacity-60" />
              <p className="text-xs text-text-muted">No hay documentos en la base de conocimiento</p>
            </div>
          )}
        </div>

        {/* Zona de Drop para agregar más fuentes */}
        <div className="mt-4">
          <div
            {...getRootProps()}
            className={clsx(
              "border border-dashed rounded-xl p-6 text-center cursor-pointer select-none transition-all duration-300",
              isDragActive
                ? "border-teal-500 bg-teal-500/10"
                : "border-border-color hover:border-teal-500/50 hover:bg-bg-hover"
            )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-5 h-5 border-2 border-text-muted border-t-teal-500 rounded-full animate-spin mb-2" />
                <p className="text-xs text-text-muted">Procesando...</p>
              </div>
            ) : (
              <>
                <Plus size={20} className={clsx("mx-auto mb-2 transition-colors", isDragActive ? "text-teal-500 dark:text-teal-400" : "text-text-muted")} />
                <p className="text-[13px] font-medium text-text-main">
                  Añadir fuente
                </p>
                <p className="text-[10px] text-text-muted mt-1">
                  PDF, TXT, DOCX
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
