from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
import os
from dotenv import load_dotenv
from llama_index.llms.groq import Groq
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.prompts import PromptTemplate
from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

load_dotenv()

# Es vital usar exactamente el mismo embed_model que en la ingesta
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
Settings.llm = Groq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))

# Reutilizamos la misma configuración de persistencia
DB_PATH = "./data/chroma_db"
COLLECTION_NAME = "documentos_usuario"

from llama_index.core.vector_stores import MetadataFilters, MetadataFilter, FilterOperator, FilterCondition

def consultar_chat(pregunta: str, archivos: list[str] = None):
    # 1. Conectar a la DB existente
    db = chromadb.PersistentClient(path=DB_PATH)
    chroma_collection = db.get_or_create_collection(COLLECTION_NAME)
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    
    # 2. Cargar el índice desde el almacenamiento
    index = VectorStoreIndex.from_vector_store(vector_store)
    
    # 1. Definimos un Prompt de sistema estricto
    system_prompt = """
    Eres un asistente experto que solo responde basándose en el contexto proporcionado.
    Reglas estrictas:
    - Si la respuesta no está en el contexto, di claramente: "Lo siento, esa información no se encuentra en los documentos proporcionados."
    - No intentes responder usando tu conocimiento general ni inventes información.
    - Mantén la respuesta concisa y profesional.
    """
    
    # 2. Configuramos el motor de consulta
    filters = None
    if archivos and len(archivos) > 0:
        filtros = [
            MetadataFilter(key="file_name", value=archivo, operator=FilterOperator.EQ)
            for archivo in archivos
        ]
        filters = MetadataFilters(filters=filtros, condition=FilterCondition.OR)
        query_engine = index.as_query_engine(
            system_prompt=system_prompt,
            filters=filters
        )
    else:
        query_engine = index.as_query_engine(
            system_prompt=system_prompt
        )
    
    response = query_engine.query(pregunta)
    return str(response)
