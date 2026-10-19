# CodAR

## Objetivo


## Contexto de uso

## Problema

## Funcionalidades

## Tecnologias utilizadas
- a-frame
- FastApi
- javaScript
- SketchFab

## Metodologia

## Resultados

## Benefícios

## Limitações

## Desafios

## Conclusão



### Backend

Criando a venv:
python -m venv venv 

 
#### Para rodar um servidor local da api
- Ativando a venv: .\venv\Scripts\Activate.ps1
- Desativando a venv: deactivate
- Se for necessário permitir a execução do script para a venv funcionar, usar: Set-ExecutionPolicy Unrestricted -Scope Process 
- Rodando FastApi: uvicorn main:app --reload 

### Frontend
- Executando um servidor http local para renderizar as imagens: python -m http.server 8080