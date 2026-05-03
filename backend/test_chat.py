import traceback
from services.chat import consultar_chat

try:
    print(consultar_chat('¿Para qué sirve nice y renice?'))
except Exception as e:
    traceback.print_exc()
