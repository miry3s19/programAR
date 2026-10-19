let traceSteps = [];
let currentStepIndex = 0;

// Requisição para a API, que responde com o json
async function carregarTraceDoBackend(codigoC) {
    try {
        let response = await fetch('https://programar-api.onrender.com/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codigoC })
        });
        let data = await response.json();
        traceSteps = data.trace; 
        currentStepIndex = 0;
        atualizarVisualizacaoAR();
    } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
    }
}

//Controle de navegação pelos botões de passo
function mudarPasso(direcao) {
    if (traceSteps.length === 0) return;
    
    currentStepIndex += direcao;
    if (currentStepIndex < 0) currentStepIndex = 0;
    if (currentStepIndex >= traceSteps.length) currentStepIndex = traceSteps.length - 1;

    atualizarVisualizacaoAR();
}

// Renderiza a estante e os chips
function atualizarVisualizacaoAR() {
    const anchor = document.querySelector('#ar-anchor');
    if (!anchor) return;

    // Limpa os elementos visuais anteriores
    const elementosAntigos = anchor.querySelectorAll('.memory-element');
    elementosAntigos.forEach(el => el.remove());

    // Atualiza o contador de passos na UI HTML
    const infoSpan = document.getElementById('stepInfo');
    if (infoSpan) {
        infoSpan.innerText = `Passo ${currentStepIndex + 1}/${traceSteps.length}`;
    }

    if (traceSteps.length === 0) return;

    let passoAtual = traceSteps[currentStepIndex];
    
    if (passoAtual.stack_to_render && passoAtual.stack_to_render.length > 0) {
        let locals = passoAtual.stack_to_render[0].encoded_locals;
        let varnames = passoAtual.stack_to_render[0].ordered_varnames || Object.keys(locals);

        let numShelves = varnames.length; 
        
        let shelfHeight = 3; 
        let shelfWidth = 3;  
        
        let totalCols = Math.ceil(numShelves / 4);

        // Estantes
        varnames.forEach((varName, index) => {
            let col = Math.floor(index / 4); 
            let row = index % 4;             

            let itemsInThisCol = Math.min(4, numShelves - (col * 4));
            let posY = (itemsInThisCol - 1 - row) * shelfHeight;

            let posX = (col - (totalCols - 1) / 2) * shelfWidth;

            let shelfEntity = document.createElement('a-gltf-model');
            shelfEntity.setAttribute('class', 'memory-element');
            shelfEntity.setAttribute('src', '#shelf');
            shelfEntity.setAttribute('position', `${posX} ${posY} -0.5`);
            shelfEntity.setAttribute('scale', '0.01 0.01 0.01');
            anchor.appendChild(shelfEntity);
            
            // Cria a etiqueta para a estante
            let shelfLabelContainer = document.createElement('a-entity');
            shelfLabelContainer.setAttribute('class', 'memory-element');
            shelfLabelContainer.setAttribute('position', `${posX + 1.5} ${posY + 0.03} -0.4`);  
            shelfLabelContainer.setAttribute('scale', '0.5 0.5 0.5');                  

            let shelfPlate = document.createElement('a-box');
            shelfPlate.setAttribute('width', '3.2');
            shelfPlate.setAttribute('height', '0.5');
            shelfPlate.setAttribute('depth', '0.05');
            shelfPlate.setAttribute('color', '#e80707');
            shelfPlate.setAttribute('position', '0 0 0');
            shelfLabelContainer.appendChild(shelfPlate);

            let shelfText = document.createElement('a-text');
            let enderecoVar = locals[varName] ? locals[varName][1] : "?";
            shelfText.setAttribute('value', `${enderecoVar} <- ${varName}`);
            shelfText.setAttribute('align', 'center');
            shelfText.setAttribute('anchor', 'center');
            shelfText.setAttribute('baseline', 'center');
            shelfText.setAttribute('position', '0 0 0.03');
            shelfText.setAttribute('scale', '2 2 2');
            shelfText.setAttribute('width', '4');
            shelfText.setAttribute('color', '#FFFFFF');
            shelfLabelContainer.appendChild(shelfText);

            anchor.appendChild(shelfLabelContainer);
            

            // A variável já possui valor diferente de <UNINITIALIZED>?
            let foiInicializada = false;
            for (let i = 0; i <= currentStepIndex; i++) {
                let p = traceSteps[i];
                if (p.stack_to_render && p.stack_to_render.length > 0) {
                    let locsStep = p.stack_to_render[0].encoded_locals;
                    if (locsStep[varName] && locsStep[varName][3] !== "<UNINITIALIZED>") {
                        foiInicializada = true;
                        break;
                    }
                }
            }

            // Chips
            if (foiInicializada) {
                let chipEntity = document.createElement('a-gltf-model');
                chipEntity.setAttribute('class', 'memory-element');
                chipEntity.setAttribute('src', '#chip');
                chipEntity.setAttribute('position', `${posX + 1} ${posY - 3.9} 4`); 
                chipEntity.setAttribute('scale', '0.05 0.05 0.05'); 
                anchor.appendChild(chipEntity);

                // Etiqueta do chip
                let valorAtual = "?";
                let locsAtual = passoAtual.stack_to_render[0].encoded_locals;
                if (locsAtual[varName]) {
                    valorAtual = locsAtual[varName][3];
                }

                let chipLabelContainer = document.createElement('a-entity');
                chipLabelContainer.setAttribute('class', 'memory-element');
                chipLabelContainer.setAttribute('position', `${posX + 1.81} ${posY - 1.4} -1.5`);
                chipLabelContainer.setAttribute('scale', '0.9 0.9 0.9');

                let chipPlate = document.createElement('a-box');
                chipPlate.setAttribute('width', '1.5');
                chipPlate.setAttribute('height', '0.4');
                chipPlate.setAttribute('depth', '0.05');
                chipPlate.setAttribute('color', '#d3d3d3');   
                chipLabelContainer.appendChild(chipPlate);

                 // Adequação dos tamanhos das strings pra não ultrapassar a etiqueta
                let valorStr = String(valorAtual);

                const MAX_CHARS = 16;
                if (valorStr.length > MAX_CHARS) {
                    valorStr = valorStr.substring(0, MAX_CHARS - 1) + "…";
                }

                let escalaBase = 2;
                let escalaTexto = Math.max(0.7, escalaBase * (7 / Math.max(7, valorStr.length)));

                let chipText = document.createElement('a-text');
                chipText.setAttribute('value', valorStr);
                chipText.setAttribute('align', 'center');
                chipText.setAttribute('anchor', 'center');
                chipText.setAttribute('baseline', 'center');
                chipText.setAttribute('position', '0 0 0.03');
                chipText.setAttribute('scale', `${escalaTexto} ${escalaTexto} ${escalaTexto}`);
                chipText.setAttribute('width', '4');
                chipText.setAttribute('color', '#000000');
                chipLabelContainer.appendChild(chipText);
                
                anchor.appendChild(chipLabelContainer);
            }
        });
    }
}