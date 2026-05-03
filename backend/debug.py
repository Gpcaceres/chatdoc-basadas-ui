import traceback
from services.ingesta import procesar_y_almacenar

try:
    print(procesar_y_almacenar('temp_uploads'))
except Exception as e:
    traceback.print_exc()
