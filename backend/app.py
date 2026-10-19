'''
URL exemplo


https://pythontutor.com/web_exec_c.py
?user_script=int%20main()%20%7B%0A%20%20%20%20int%20a%20%3D%2042%3B%0A%20%20%20%20int%20*p%20%3D%20%26a%3B%0A%20%20%20%20*p%20%3D%2099%3B%0A%20%20%20%20return%200%3B%0A%7D
&raw_input_json=
&options_json=
%7B%22cumulative_mode%22%3Afalse%2C%22
heap_primitives%22%3Afalse%2C%22
show_only_outputs%22%3Afalse%2C%22
origin%22%3A%22opt-frontend.js%22%2C%22
cpp_version%22%3A%22c_gcc9.3.0%22%2C%22
fe_disableHeapNesting%22%3Atrue%2C%22
fe_textualMemoryLabels%22%3Afalse%2C%22
fe_matrixMode%22%3Afalse%7D
&n=614&user_uuid=bb89107b-3f4f-4a52-8b94-515cb5c314c4
&session_uuid=1bf77590-69d7-4c6f-8eea-ebe4f1e0a4ba


'''

import requests
import json

def run_c_code(code_c):
    url = "https://pythontutor.com/web_exec_c.py"

    params = {
        "user_script": code_c,
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

    resposta = requests.get(url, params=params, headers=headers)
    return resposta.json()
# Teste local
resultado = run_c_code("""
int main() {
    int a = 42;
    int *p = &a;
    *p = 99;
    return 0;
}
""")

print("Passos retornados:", len(resultado.get("trace", [])))
