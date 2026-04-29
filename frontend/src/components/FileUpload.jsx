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
} from "lucide-react";
import { uploadDocument } from "../api/api";

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
        toast.success(`"${file.name}" ingestado correctamente`);
      } catch {
        res.push({ name: file.name, ok: false });
        toast.error(`Error al procesar "${file.name}"`);
      }
    }

    setResults(res);
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          Cargar Documentos
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Arrastra y suelta tus archivos o haz clic para explorar. Formatos
          aceptados:{" "}
          <span className="font-medium text-slate-600">
            PDF · TXT · DOC · DOCX
          </span>
          .
        </p>

        {/* Zona de drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer select-none transition-all ${
            isDragActive
              ? "border-blue-500 bg-blue-50 scale-[1.01]"
              : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud
            size={44}
            className={`mx-auto mb-4 transition-colors ${
              isDragActive ? "text-blue-500" : "text-slate-400"
            }`}
          />
          {isDragActive ? (
            <p className="text-blue-600 font-semibold text-base">
              Suelta los archivos aquí
            </p>
          ) : (
            <>
              <p className="text-slate-700 font-medium text-base">
                Arrastra y suelta archivos aquí
              </p>
              <p className="text-slate-400 text-sm mt-1">
                o{" "}
                <span className="text-blue-500 underline underline-offset-2">
                  haz clic para seleccionar
                </span>
              </p>
            </>
          )}
          <p className="text-xs text-slate-400 mt-4">PDF · TXT · DOC · DOCX</p>
        </div>

        {/* Lista de archivos pendientes */}
        {files.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-medium text-slate-600 mb-2">
              {files.length} archivo{files.length > 1 ? "s" : ""} seleccionado
              {files.length > 1 ? "s" : ""}
            </p>

            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm"
              >
                <FileText size={16} className="text-blue-500 flex-shrink-0" />
                <span className="flex-1 text-sm text-slate-700 truncate">
                  {f.name}
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
                <button
                  onClick={() => removeFile(i)}
                  className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-1"
                  title="Quitar archivo"
                >
                  <X size={15} />
                </button>
              </div>
            ))}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-3 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading
                ? "Procesando archivos…"
                : `Ingestar ${files.length} archivo${files.length > 1 ? "s" : ""}`}
            </button>
          </div>
        )}

        {/* Resultados de ingesta */}
        {results.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-medium text-slate-600 mb-2">
              Resultados de ingesta
            </p>

            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm border ${
                  r.ok
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {r.ok ? (
                  <CheckCircle size={16} className="flex-shrink-0" />
                ) : (
                  <XCircle size={16} className="flex-shrink-0" />
                )}
                <span className="flex-1 truncate">{r.name}</span>
                <span className="ml-auto flex-shrink-0 font-medium">
                  {r.ok ? "Procesado" : "Error"}
                </span>
              </div>
            ))}

            <button
              onClick={onDone}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Ir al Chat
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
