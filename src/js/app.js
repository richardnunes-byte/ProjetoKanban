const formulario = document.querySelector('.task-form');
const campotarefa = document.querySelector('#new-task');
const listaafazer = document.querySelector('.todo-column .task-list');
const listaandamento = document.querySelector('.progress-column .task-list');
const listaconcluidas = document.querySelector('.done-column .task-list');
const totaltarefas = document.querySelector('.board-total');
const mensagemvazia = document.querySelector('.empty-state');
const campodescricao = document.querySelector('#task-description');
let statusEscolhido = 'todo';

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

function moverTarefa(cartao, novoStatus) {
    cartao.dataset.status = novoStatus;

    const novaLista = pegarLista(novoStatus);
    novaLista.appendChild(cartao);

    prepararTarefa(cartao);
    atualizarcontadores();
}

document.querySelectorAll('.task-list').forEach(function (lista) {
    lista.addEventListener('dragstart', function (evento) {
        const cartao = evento.target.closest('.task-card');

        if (!cartao) {
            return;
        }

        cartao.classList.add('dragging');
        evento.dataTransfer.effectAllowed = 'move';
        evento.dataTransfer.setData('text/plain', 'task');
    });

    lista.addEventListener('dragend', function (evento) {
        evento.target.closest('.task-card')?.classList.remove('dragging');
        document.querySelectorAll('.task-list').forEach(function (outraLista) {
            outraLista.classList.remove('drag-over');
        });
    });

    lista.addEventListener('dragover', function (evento) {
        evento.preventDefault();
        lista.classList.add('drag-over');
    });

    lista.addEventListener('dragleave', function (evento) {
        if (!lista.contains(evento.relatedTarget)) {
            lista.classList.remove('drag-over');
        }
    });

    lista.addEventListener('drop', function (evento) {
        evento.preventDefault();
        const cartao = document.querySelector('.task-card.dragging');
        const coluna = lista.closest('.kanban-column');

        if (cartao && coluna) {
            moverTarefa(cartao, coluna.dataset.status);
        }

        lista.classList.remove('drag-over');
    });
});

function prepararTarefa(cartao) {
    const botao = cartao.querySelector('.card-menu');
    const status = cartao.dataset.status;

    if (status === 'todo') {
        cartao.classList.remove('completed-task');
    } else if (status === 'progress') {
        cartao.classList.remove('completed-task');
    } else {
        cartao.classList.add('completed-task');
    }

    botao.textContent = '•••';
    botao.disabled = false;
    botao.setAttribute('aria-label', 'Opções da tarefa');
}

function fecharMenus() {
    document.querySelectorAll('.card-actions').forEach(function (menu) {
        menu.remove();
    });
}

document.addEventListener('click', function (evento) {
    const botaoMenu = evento.target.closest('.card-menu');

    if (botaoMenu) {
        evento.stopPropagation();
        const cartao = botaoMenu.closest('.task-card');
        const menuExistente = cartao.querySelector('.card-actions');

        fecharMenus();

        if (!menuExistente) {
            const menu = document.createElement('div');
            const excluir = document.createElement('button');

            menu.className = 'card-actions';
            excluir.type = 'button';
            excluir.textContent = 'Excluir tarefa';
            excluir.addEventListener('click', function () {
                cartao.remove();
                atualizarcontadores();
            });
            menu.appendChild(excluir);
            botaoMenu.closest('.task-card-top').appendChild(menu);
        }

        return;
    }

    if (!evento.target.closest('.card-actions')) {
        fecharMenus();
    }
});
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nomeTarefa = campotarefa.value.trim();
    const descricaoTarefa = campodescricao.value.trim();

    if (nomeTarefa === '') {
        alert('Digite o nome da tarefa antes de adicionar.');
        return;
    }

    const novaTarefa = document.createElement('article');

    novaTarefa.classList.add('task-card');
    novaTarefa.draggable = true;
    novaTarefa.dataset.status = statusEscolhido;

    novaTarefa.innerHTML = `
        <div class="task-card-top">
         <span class="priority low">Baixa</span>
         <button class="card-menu" type="button">Concluir</button>
    </div>

    <h3></h3>

     <p class="task-description"></p>
    
    `;

    novaTarefa.querySelector('h3').textContent = nomeTarefa;
    novaTarefa.querySelector('.task-description').textContent = descricaoTarefa || 'Tarefa adicionada pelo formulário.';

    pegarLista(statusEscolhido).appendChild(novaTarefa);

    prepararTarefa(novaTarefa);

    campotarefa.value = '';
    campodescricao.value = '';
    campotarefa.focus();

    atualizarcontadores();


});

const botoesAdicionar = document.querySelectorAll('.add-inline');

botoesAdicionar.forEach(function (botao) {
    botao.addEventListener('click', function () {
        const coluna = botao.closest('.kanban-column');
        statusEscolhido = coluna.dataset.status;

        if (statusEscolhido === 'progress') {
            campotarefa.placeholder = 'Nova tarefa em andamento';
        } else if (statusEscolhido === 'done') {
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