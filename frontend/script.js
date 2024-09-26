// Função para buscar clientes da API e exibir na página
async function fetchClientes() {
    try {
        const response = await fetch('http://127.0.0.1:5001/clientes'); // Faz uma requisição GET para a API
        const clientes = await response.json(); // Converte a resposta para JSON

        const clientesList = document.getElementById('clientes-list');
        clientesList.innerHTML = ''; // Limpa o conteúdo atual do tbody

        // Adiciona os clientes na tabela
        clientes.forEach(cliente => {
            const row = document.createElement('tr'); // Cria uma nova linha
            row.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.sobrenome}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.endereco}</td>
                <td>${cliente.cep}</td>
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
        const response = await fetch('http://127.0.0.1:5001/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoCliente)
        });

        const responseText = await response.text(); // Obter a resposta em texto
        console.log('Resposta da API:', responseText); // Log para ver a resposta da API

        if (response.ok) {
            // Se a requisição foi bem-sucedida, recarrega a lista de clientes
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

