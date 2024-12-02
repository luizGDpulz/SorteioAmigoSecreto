let participantes = [];
let restricoes = [];
let resultadoSorteio = null;

// Funções de atualização da interface
function atualizarListaParticipantes() {
    const tbody = document.querySelector('#tabela-participantes tbody');
    tbody.innerHTML = '';
    
    participantes.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.className = 'new-row';
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.nome || p}</td>
            <td>${p.email || '-'}</td>
            <td>
                <div class="participant-actions">
                    <button class="btn btn-outline-info action-btn" 
                            title="Link individual do sorteio" 
                            onclick="mostrarCodigo(${index})">
                        <i class="fas fa-link"></i>
                    </button>
                    <button class="btn btn-outline-danger action-btn" 
                            title="Remover participante" 
                            onclick="confirmarRemocaoParticipante(${index})">
                        <i class="fas fa-user-minus"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarListaRestricoes() {
    const lista = document.getElementById('restricoes-container');
    lista.innerHTML = '';
    restricoes.forEach((r, index) => {
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${r.pessoa1} não pode tirar ${r.pessoa2}
                <button class="btn btn-sm btn-danger" onclick="removerRestricao(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `;
    });
}

function atualizarSelects() {
    const selects = ['pessoa1', 'pessoa2'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Selecione...</option>';
        participantes.forEach(p => {
            const nome = p.nome || p;
            select.innerHTML += `<option value="${nome}">${nome}</option>`;
        });
    });
}

// Funções de manipulação de participantes
async function adicionarParticipante() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    if (!nome) return;

    const response = await fetch('/api/participante', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome, email})
    });

    if (response.ok) {
        participantes.push({nome, email});
        atualizarSelects();
        atualizarListaParticipantes();
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
    }
}

function removerParticipante(index) {
    if (confirm('Tem certeza que deseja remover este participante?')) {
        participantes.splice(index, 1);
        atualizarListaParticipantes();
        atualizarSelects();
    }
}

// Funções de manipulação de restrições
async function adicionarRestricao() {
    const pessoa1 = document.getElementById('pessoa1').value;
    const pessoa2 = document.getElementById('pessoa2').value;
    if (!pessoa1 || !pessoa2 || pessoa1 === pessoa2) return;

    await fetch('/api/restricao', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pessoa1, pessoa2})
    });

    restricoes.push({pessoa1, pessoa2});
    atualizarListaRestricoes();
}

function removerRestricao(index) {
    restricoes.splice(index, 1);
    atualizarListaRestricoes();
}

// Funções do sorteio
async function realizarSorteio() {
    const response = await fetch('/api/sorteio', {
        method: 'POST'
    });
    
    const resultado = await response.json();
    if (response.ok) {
        resultadoSorteio = resultado;
        document.getElementById('sorteio-info').style.display = 'block';
        document.getElementById('sorteio-detalhes').style.display = 'none';
        atualizarResultadoSorteio();
    }
}

function toggleResultados() {
    const detalhes = document.getElementById('sorteio-detalhes');
    detalhes.style.display = detalhes.style.display === 'none' ? 'block' : 'none';
}

function atualizarResultadoSorteio() {
    if (!resultadoSorteio) return;
    
    let html = '<ul class="list-group">';
    for (const [pessoa, amigo] of Object.entries(resultadoSorteio)) {
        html += `
            <li class="list-group-item">
                ${pessoa} → ${amigo}
            </li>
        `;
    }
    html += '</ul>';
    document.getElementById('sorteio-detalhes').innerHTML = html;
}

// Funções auxiliares
function mostrarCodigo(index) {
    const participante = participantes[index];
    const nome = typeof participante === 'string' ? participante : participante.nome;
    
    const url = `${window.location.origin}/participante/${index}`;
    const modal = `
        <div class="modal fade" id="codigoModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-link"></i> Link Individual
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="link-icon mb-3">
                            <i class="fas fa-gift"></i>
                        </div>
                        <h5>Link para ${nome}</h5>
                        <div class="input-group mt-3">
                            <input type="text" class="form-control" value="${url}" readonly>
                            <button class="btn btn-outline-info" onclick="copiarLink('${url}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="mt-3 text-muted">
                            <small>
                                <i class="fas fa-info-circle"></i>
                                Compartilhe este link apenas com ${nome}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalAntigo = document.getElementById('codigoModal');
    if (modalAntigo) modalAntigo.remove();
    
    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('codigoModal'));
    modalElement.show();
}

function copiarLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copiado para a área de transferência!');
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/participantes');
    const data = await response.json();
    participantes = data.participantes;
    restricoes = Object.entries(data.restricoes).map(([pessoa1, pessoas]) => 
        pessoas.map(pessoa2 => ({pessoa1, pessoa2}))
    ).flat();
    atualizarListaParticipantes();
    atualizarListaRestricoes();
    atualizarSelects();
}); 

// Adiciona ao corpo do documento
document.body.appendChild(div);

// Remove após 3 segundos
setTimeout(() => {
    div.remove();
}, 3000);

// Adicione estas novas funções
function confirmarReset() {
    const modal = new bootstrap.Modal(document.getElementById('resetModal'));
    modal.show();
}

async function resetarSistema() {
    try {
        const response = await fetch('/api/reset', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            // Limpa os dados locais
            participantes = [];
            restricoes = [];
            resultadoSorteio = null;

            // Atualiza a interface
            atualizarListaParticipantes();
            atualizarListaRestricoes();
            atualizarSelects();

            // Limpa a seção de resultado
            document.getElementById('sorteio-info').style.display = 'none';
            document.getElementById('sorteio-detalhes').innerHTML = '';

            // Fecha o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
            modal.hide();

            // Mostra mensagem de sucesso
            mostrarMensagem('Sistema resetado com sucesso!', 'success');
        } else {
            throw new Error('Erro ao resetar o sistema');
        }
    } catch (error) {
        mostrarMensagem('Erro ao resetar o sistema. Tente novamente.', 'error');
    }
}

// Adicione esta função para mostrar mensagens
function mostrarMensagem(mensagem, tipo) {
    // Remove mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.mensagem-flutuante');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    // Cria nova mensagem
    const div = document.createElement('div');
    div.className = `mensagem-flutuante alert alert-${tipo === 'success' ? 'success' : 'danger'}`;
    div.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${mensagem}
    `;

    // Adiciona ao corpo do documento
    document.body.appendChild(div);

    // Remove após 3 segundos
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// Adicione estas novas funções
function confirmarRemocaoParticipante(index) {
    const participante = participantes[index];
    const nome = participante.nome || participante;
    
    const modal = `
        <div class="modal fade" id="removerParticipanteModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-user-minus"></i> Remover Participante
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="remove-participant-icon mb-3">
                            <i class="fas fa-user-times"></i>
                        </div>
                        <h5>Tem certeza que deseja remover?</h5>
                        <p class="participant-name-display">${nome}</p>
                        <div class="alert alert-warning mt-3">
                            <i class="fas fa-exclamation-triangle"></i>
                            Esta ação não pode ser desfeita!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="button" class="btn btn-danger" onclick="removerParticipante(${index})">
                            <i class="fas fa-user-minus"></i> Remover
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove modal anterior se existir
    const modalAntigo = document.getElementById('removerParticipanteModal');
    if (modalAntigo) modalAntigo.remove();
    
    // Adiciona e mostra o novo modal
    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('removerParticipanteModal'));
    modalElement.show();
} 