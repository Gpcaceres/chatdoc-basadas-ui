import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  XCircle,
  X,
  ArrowRight,
  FileBox
} from "lucide-react";
import { uploadDocument } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
};

export default function FileUpload({ onDone }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setResults([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
  });

  const removeFile = (idx) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleUpload = async () => {
    if (!files.length || uploading) return;
    setUploading(true);
    const res = [];

    for (const file of files) {
      try {
        await uploadDocument(file);
        res.push({ name: file.name, ok: true });
        toast.success(`"${file.name}" procesado con éxito`, { icon: '✨' });
      } catch {
        res.push({ name: file.name, ok: false });
        toast.error(`Error al subir "${file.name}"`);
      }
    }

    setResults(res);
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-custom flex flex-col pt-12 pb-32">
      <div className="max-w-2xl mx-auto w-full px-6">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
            <FileBox className="text-indigo-400" size={32} />
          </div>
          <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-3">
            Base de Conocimiento
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
            Sube tus documentos para que la IA los analice y pueda responder preguntas sobre ellos de forma inteligente.
          </p>
        </div>

        {/* Zona de drop */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          {...getRootProps()}
          className={clsx(
            "glass-panel border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer select-none transition-all duration-300 relative overflow-hidden group",
            isDragActive
              ? "border-indigo-500 bg-indigo-500/5"
              : "border-zinc-700 hover:border-indigo-500/50 hover:bg-white/5"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <input {...getInputProps()} />
          <UploadCloud
            size={48}
            className={clsx(
              "mx-auto mb-5 transition-colors duration-300",
              isDragActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-indigo-400"
            )}
          />
          {isDragActive ? (
            <p className="text-indigo-400 font-semibold text-lg">
              Suelta los archivos ahora...
            </p>
          ) : (
            <>
              <p className="text-zinc-200 font-medium text-lg mb-1">
                Arrastra y suelta tus archivos aquí
              </p>
              <p className="text-zinc-500 text-sm">
                o{" "}
                <span className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
                  haz clic para buscar en tu equipo
                </span>
              </p>
            </>
          )}
          <div className="mt-6 flex justify-center gap-2">
            {["PDF", "TXT", "DOCX"].map(ext => (
              <span key={ext} className="px-2.5 py-1 rounded-md bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 text-xs font-medium tracking-widest">
                {ext}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Archivos pendientes y Resultados combinados en un contenedor */}
        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
                    Archivos a procesar ({files.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {files.map((f, i) => (
                      <motion.div
                        key={`${f.name}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-4 glass-panel rounded-2xl px-4 py-3 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">
                            {f.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                          title="Eliminar"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-6 w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20 relative overflow-hidden"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </div>
                  ) : (
                    "Ingestar Documentos"
                  )}
                </motion.button>
              </motion.div>
            )}

            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mt-8"
              >
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest text-center mb-4">
                  Resultados
                </h3>

                <div className="space-y-2">
                  {results.map((r, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className={clsx(
                        "flex items-center gap-4 px-4 py-3 rounded-2xl border",
                        r.ok
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/5 border-red-500/20 text-red-400"
                      )}
                    >
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        r.ok ? "bg-emerald-500/10" : "bg-red-500/10"
                      )}>
                        {r.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </div>
                      <span className="flex-1 text-sm font-medium text-zinc-200 truncate">{r.name}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {r.ok ? "Éxito" : "Error"}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDone}
                  className="mt-8 w-full flex items-center justify-center gap-2 py-4 glass-panel hover:bg-white/10 text-white font-semibold rounded-2xl transition-colors ring-1 ring-white/10"
                >
                  Ir al Chat
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
