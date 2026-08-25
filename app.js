const formulario = document.querySelector('.task-form');
const campotarefa = document.querySelector('#new-task');
const listaafazer = document.querySelector('.todo-column .task-list');
const listaandamento = document.querySelector('.progress-column .task-list');
const listaconcluidas = document.querySelector('.done-column .task-list');
const totaltarefas = document.querySelector('.board-total');
const mensagemvazia = document.querySelector('.empty-state');

function atualizarcontadores() {
    const colunas = document.querySelectorAll('.kanban-column');

    colunas.forEach(function (coluna) {
        const quantidade = coluna.querySelectorAll('.task-card').length;
        const contador = coluna.querySelector('.task-count');

        contador.textContent = quantidade;
    });

    const quantidadeTotal = document.querySelectorAll('.task-card').length;

    if (quantidadeTotal === 1) {
        totaltarefas.textContent = '1 tarefa';
    } else {
        totaltarefas.textContent = quantidadeTotal + ' tarefas';
    }

    if (quantidadeTotal === 0) {
        mensagemvazia.style.display = 'block';
    } else {
        mensagemvazia.style.display = 'none';
    }
}

function pegarLista(status) {
    if (status === 'progress') {
        return listaandamento;
    }

    if (status === 'done') {
        return listaconcluidas;
    }

    return listaafazer;
}

function concluirTarefa(cartao) {
    cartao.dataset.status = 'done';
    cartao.classList.add('completed-task');

    const botao = cartao.querySelector('.card-menu');

    botao.textContent = 'Concluida';
    botao.disabled = true;

    listaconcluidas.appendChild(cartao);

    atualizarcontadores();
}

function moverTarefa(cartao, novoStatus) {
    cartao.dataset.status = novoStatus;

    const novaLista = pegarLista(novoStatus);
    novaLista.appendChild(cartao);

    prepararTarefa(cartao);
    atualizarcontadores();
}

function prepararTarefa(cartao) {
    const botao = cartao.querySelector('.card-menu');
    const status = cartao.dataset.status;

    if (status === 'todo') {
        cartao.classList.remove('completed-task');

        botao.disabled = false;
        botao.textContent = 'Em andamento';
        botao.style.letterSpacing = 'normal';
        botao.setAttribute('aria-label', 'Mover tarefa para em andamento');

        botao.onclick = function () {
            moverTarefa(cartao, 'progress');
        };

    } else if (status === 'progress') {
        cartao.classList.remove('completed-task');

        botao.disabled = false;
        botao.textContent = 'Concluir';
        botao.style.letterSpacing = 'normal';
        botao.setAttribute('aria-label', 'Marcar tarefa como concluída');

        botao.onclick = function () {
            moverTarefa(cartao, 'done');
        };

    } else {
        cartao.classList.add('completed-task');

        botao.textContent = 'Concluída';
        botao.style.letterSpacing = 'normal';
        botao.disabled = true;
        botao.onclick = null;
    }
}
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nomeTarefa = campotarefa.value.trim();

    if (nomeTarefa === '') {
        alert('Digite o nome da tarefa antes de adicionar.');
        return;
    }

    const novaTarefa = document.createElement('article');

    novaTarefa.classList.add('task-card');
    novaTarefa.dataset.status = 'todo';

    novaTarefa.innerHTML = `
        <div class="task-card-top">
         <span class="priority low">Baixa</span>
         <button class="card-menu" type="button">Concluir</button>
    </div>

    <h3></h3>

    <p class="task-description">
       Tarefa adicionada pelo formulário.
    </p>
    
    `;

    novaTarefa.querySelector('h3').textContent = nomeTarefa;

    listaafazer.appendChild(novaTarefa);

    prepararTarefa(novaTarefa);

    campotarefa.value = '';
    campotarefa.focus();

    atualizarcontadores();


});

const botoesAdicionar = document.querySelectorAll('.add-inline');

botoesAdicionar.forEach(function (botao) {
    botao.addEventListener('click', function () {
        const coluna = botao.closest('.kanban-column');
        colunaEscolhida = coluna.dataset.status;

        if (colunaEscolhida === 'progress') {
            campotarefa.placeholder = 'Nova tarefa em andamento';
        } else if (colunaEscolhida === 'done') {
            campotarefa.placeholder = 'Nova tarefa concluída';
        } else {
            campotarefa.placeholder = 'Nova tarefa a fazer';
        }

        campotarefa.focus();
    });
});

const tarefasInciais = document.querySelectorAll('.task-card');

tarefasInciais.forEach(function (tarefa) {
    prepararTarefa(tarefa);
});

atualizarcontadores();