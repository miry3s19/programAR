'''
1.Import FastAPI.
2.Create an app instance.
3.Write a path operation decorator using decorators like @app.get("/").
4.Define a path operation function; for example, def root(): ....
5.Run the development server using the command fastapi dev.
6.Optionally deploy your app with fastapi deploy.
'''
from fastapi import FastAPI #1.
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
#import easyocr

app = FastAPI() #2. Instanciar a aplicação. app gerencia rotas

#configura a liberação de acesso de qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # libera pra qualquer site/página local chamar a API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#reader = easyocr.Reader(['en'], download_enabled=False)


class CodeRequest(BaseModel): #Data model para dados de entrada
    code: str

#3. Criar um path(parte da url apos primeira barra) operation(metodo http)
@app.get("/")#3.
async def root():#4.
    return {"message": "API funcionando :)"} #Retornar o conteúdo
#Função a ser executada quando alguém acessar a raiz do site

'''
@app.post("/ocr")
async def process_ocr(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        results = reader.readtext(contents, detail=0)
        
        codigo_extraido = "\n".join(results)
        
        return {
            "success": True, 
            "code": codigo_extraido
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no OCR: {str(e)}")
'''

@app.post("/trace/")
async def receive_code(request: CodeRequest): #recebe código digitado pelo usuário
    url = "https://pythontutor.com/web_exec_c.py"

    params = {
        "user_script": request.code, #código que veio pelo POST
        "raw_input_json": "",
        "options_json": json.dumps({
            "cumulative_mode": False,
            "heap_primitives": False,
            "show_only_outputs": False,
            "origin": "opt-frontend.js",
            "cpp_version": "c_gcc9.3.0",
            "fe_disableHeapNesting": True,
            "fe_textualMemoryLabels": False,
            "fe_matrixMode": False
            })
        }

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"}

    try: #faz a chamada pro pythontutor e retorna o trace em json
        resposta = requests.get(url, params=params, headers=headers)
        dados = resposta.json()
        return {
            "success": True,
            "trace": dados.get("trace", []) 
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
