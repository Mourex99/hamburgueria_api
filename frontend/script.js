// Função para buscar clientes da API e exibir na página
async function fetchClientes() {
    try {
        const response = await fetch('https://backend-api-hamburgueria-buck.vercel.app/clientes'); // Faz uma requisição GET para a API
        const clientes = await response.json(); // Converte a resposta para JSON

        const clientesList = document.getElementById('clientes-list');
        clientesList.innerHTML = ''; // Limpa o conteúdo atual do tbody

        // Adiciona os clientes na tabela
        clientes.forEach(cliente => {
            const row = document.createElement('tr'); // Cria uma nova linha
            row.innerHTML = `
                <td id="nome-${cliente.id}" contenteditable="false">${cliente.nome}</td>
                <td id="sobrenome-${cliente.id}" contenteditable="false">${cliente.sobrenome}</td>
                <td id="telefone-${cliente.id}" contenteditable="false">${cliente.telefone}</td>
                <td id="endereco-${cliente.id}" contenteditable="false">${cliente.endereco}</td>
                <td id="cep-${cliente.id}" contenteditable="false">${cliente.cep}</td>
                <td>
                    <div class="dropdown">
                        <button class="dropdown-btn" onclick="toggleDropdown(this)">Editar</button>
                        <div class="dropdown-content" style="display: none;">
                            <a href="#" onclick="habilitarEdicao(${cliente.id})">Alterar Dados</a>
                            <a href="#" onclick="deletarCliente(${cliente.id})">Deletar</a>
                        </div>
                    </div>
                </td>
            `;
            clientesList.appendChild(row); // Adiciona a linha ao tbody
        });
    } catch (error) {
        console.error('Erro ao buscar os clientes:', error);
    }
}

window.onload = fetchClientes; // Chama a função ao carregar a página

// Função para cadastrar um novo cliente na API
async function cadastrarCliente() {
    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const telefone = document.getElementById('telefone').value; // Corrigido
    const endereco = document.getElementById('endereco').value;
    const cep = document.getElementById('cep').value;

    // Cria um objeto com os dados do cliente
    const novoCliente = {
        nome: nome,
        sobrenome: sobrenome,
        telefone: telefone,
        endereco: endereco,
        cep: cep
    };

    console.log('Enviando dados:', novoCliente); // Log para ver os dados enviados

    try {
        // Faz uma requisição POST para cadastrar o cliente
        const response = await fetch('https://backend-api-hamburgueria-buck.vercel.app/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoCliente)
        });

        const responseText = await response.text(); // Obter a resposta em texto
        console.log('Resposta da API:', responseText); // Log para ver a resposta da API

        if (response.ok) {
            alert('Cliente cadastrado com sucesso!');// Se a requisição foi bem-sucedida, recarrega a lista de clientes
            fetchClientes();
        } else {
            console.error('Erro ao cadastrar o cliente:', response.statusText);
            alert('Falha ao cadastrar o cliente. Tente novamente!');
        }
    } catch (error) {
        console.error('Erro ao cadastrar o cliente:', error);
        alert('Falha ao cadastrar o cliente. Tente novamente!');
    }
}

// Adiciona o listener para o botão de cadastrar
document.getElementById('cadastrar-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do botão
    cadastrarCliente(); // Chama a função de cadastro
});

// Carrega a lista de clientes ao iniciar a página
window.onload = fetchClientes;

// Função para mostrar a seção de cadastro
function showCadastrar() {
    document.getElementById('cadastrar-section').style.display = 'block';
    document.getElementById('clientes-section').style.display = 'none';
}

// Função para mostrar a seção de clientes cadastrados
function showClientes() {
    document.getElementById('cadastrar-section').style.display = 'none';
    document.getElementById('clientes-section').style.display = 'block';
    fetchClientes(); // Chama a função para buscar clientes
}

// Função para filtrar clientes
function filterClientes() {
    const filtro = document.getElementById('filtro-telefone').value.toLowerCase(); // Obtém o valor do filtro
    const clientesList = document.getElementById('clientes-list'); // Referência ao tbody
    const rows = clientesList.getElementsByTagName('tr'); // Obtém todas as linhas da tabela

    // Itera sobre as linhas e oculta as que não correspondem ao filtro
    for (let i = 0; i < rows.length; i++) {
        const telefoneCell = rows[i].getElementsByTagName('td')[2]; // O telefone está na terceira coluna (índice 2)
        if (telefoneCell) {
            const telefone = telefoneCell.textContent || telefoneCell.innerText; // Obtém o texto do telefone
            // Verifica se o telefone inclui o valor do filtro
            rows[i].style.display = telefone.toLowerCase().includes(filtro) ? '' : 'none';
        }
    }
}


let originalData = {}; // Armazena os dados originais para reverter

// Função para habilitar os campos de edição para um cliente específico
function habilitarEdicao(clienteId) {
    const fields = [
        document.getElementById(`nome-${clienteId}`),
        document.getElementById(`sobrenome-${clienteId}`),
        document.getElementById(`telefone-${clienteId}`),
        document.getElementById(`endereco-${clienteId}`),
        document.getElementById(`cep-${clienteId}`)
    ];

    // Armazena os dados originais
    originalData[clienteId] = fields.map(field => field.innerText);

    // Habilita os campos e adiciona a classe de borda
    fields.forEach(field => {
        field.contentEditable = true; // Habilita a edição
        field.classList.add('editable'); // Adiciona a classe de borda
    });

    // Altera o conteúdo do dropdown para mostrar "Salvar" e "Cancelar"
    const dropdownContent = document.querySelector(`#nome-${clienteId}`).closest('tr').querySelector('.dropdown-content');
    dropdownContent.innerHTML = `
        <a href="#" onclick="salvarEdicao(${clienteId})">Salvar</a>
        <a href="#" onclick="cancelarEdicao(${clienteId})">Cancelar</a>
    `;
    dropdownContent.style.display = 'block'; // Mantém o dropdown aberto

    // Para evitar que o dropdown feche quando clicado
    dropdownContent.addEventListener('click', function(event) {
        event.stopPropagation(); // Impede que o clique se propague e feche o dropdown
    });
}

// Função para salvar as edições de um cliente
async function salvarEdicao(clienteId) {
    const fields = [
        document.getElementById(`nome-${clienteId}`),
        document.getElementById(`sobrenome-${clienteId}`),
        document.getElementById(`telefone-${clienteId}`),
        document.getElementById(`endereco-${clienteId}`),
        document.getElementById(`cep-${clienteId}`)
    ];

    // Cria um objeto com os dados atualizados do cliente
    const clienteAtualizado = {
        nome: fields[0].innerText,
        sobrenome: fields[1].innerText,
        telefone: fields[2].innerText,
        endereco: fields[3].innerText,
        cep: fields[4].innerText
    };

    try {
        // Faz uma requisição PUT para atualizar o cliente
        const response = await fetch(`https://backend-api-hamburgueria-buck.vercel.app/clientes/${clienteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        });

        if (response.ok) {
            alert('Dados do cliente atualizados com sucesso!'); // Mensagem de sucesso
            fetchClientes(); // Recarrega a lista de clientes
        } else {
            console.error('Erro ao atualizar o cliente:', response.statusText);
            alert('Falha ao atualizar os dados do cliente. Tente novamente!');
        }
    } catch (error) {
        console.error('Erro ao atualizar o cliente:', error);
        alert('Falha ao atualizar os dados do cliente. Tente novamente!');
    }
}


// Função para cancelar a edição e reverter para os dados originais
function cancelarEdicao(clienteId) {
    const fields = [
        document.getElementById(`nome-${clienteId}`),
        document.getElementById(`sobrenome-${clienteId}`),
        document.getElementById(`telefone-${clienteId}`),
        document.getElementById(`endereco-${clienteId}`),
        document.getElementById(`cep-${clienteId}`)
    ];

    // Reverte os dados para os originais
    fields.forEach((field, index) => {
        field.innerText = originalData[clienteId][index]; // Reverte o texto
        field.contentEditable = false; // Desabilita a edição
        field.classList.remove('editable'); // Remove a classe de borda
    });

    // Altera o conteúdo do dropdown de volta para "Alterar Dados" e "Deletar"
    const dropdownContent = document.querySelector(`#nome-${clienteId}`).closest('tr').querySelector('.dropdown-content');
    dropdownContent.innerHTML = `
        <a href="#" onclick="habilitarEdicao(${clienteId})">Alterar Dados</a>
        <a href="#" onclick="deletarCliente(${clienteId})">Deletar</a>
    `;

    // Fecha o dropdown
    dropdownContent.style.display = 'none'; // Fecha o dropdown
}


// Adiciona um listener para fechar o dropdown ao clicar fora
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !event.target.classList.contains('dropdown-btn')) {
            dropdown.style.display = 'none'; // Fecha o dropdown se clicar fora
        }
    });
});

// Função para alternar a exibição do dropdown
function toggleDropdown(button) {
    const dropdownContent = button.nextElementSibling; // Obtém o conteúdo do dropdown
    const row = button.closest('tr'); // Encontra a linha associada ao botão
    const isOpen = dropdownContent.classList.contains('show'); // Verifica se o dropdown está aberto

    // Fecha todos os dropdowns e remove o destaque das linhas
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
    });
    document.querySelectorAll('tr').forEach(r => r.classList.remove('highlight'));

    // Se o dropdown não estava aberto, abre ele e destaca a linha
    if (!isOpen) {
        dropdownContent.style.display = 'block'; // Exibe o dropdown
        dropdownContent.classList.add('show'); // Marca o dropdown como "show" para animações
        row.classList.add('highlight'); // Adiciona o destaque à linha
    }
}



// Função para deletar um cliente
async function deletarCliente(id) {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
        try {
            const response = await fetch(`https://backend-api-hamburgueria-buck.vercel.app/clientes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Cliente deletado com sucesso!');
                fetchClientes(); // Recarrega a lista de clientes
            } else {
                alert('Erro ao deletar o cliente.');
            }
        } catch (error) {
            console.error('Erro ao deletar o cliente:', error);
        }
    }
}