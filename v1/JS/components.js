let componentes = [];
let componenteEditando = null;
const API_URL = 'http://localhost:3000/components';

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
  carregarComponentes();
});

// Função para carregar todos os componentes
async function carregarComponentes() {
  try {
    const container = document.getElementById('componentsContainer');
    container.innerHTML = '<div class="loading">Carregando componentes...</div>';

    componentes = await httpGet(API_URL);
    renderizarComponentes(componentes);
    atualizarFiltroCategoria();
  } catch (erro) {
    console.error('Erro ao carregar componentes:', erro);
    mostrarAlerta('Erro ao carregar componentes. Verifique se o servidor está rodando.', 'error');
    document.getElementById('componentsContainer').innerHTML =
      '<div class="no-components">Erro ao carregar componentes</div>';
  }
}

// Função para renderizar componentes na tela
function renderizarComponentes(componentesParaRenderizar) {
  const container = document.getElementById('componentsContainer');

  if (componentesParaRenderizar.length === 0) {
    container.innerHTML = '<div class="no-components">Nenhum componente encontrado</div>';
    return;
  }

  const html = `
            <div class="components-grid">
                ${componentesParaRenderizar.map(componente => `
                    <div class="component-card">
                        <div class="component-header">
                            <div>
                                <div class="component-name">${componente.name}</div>
                            </div>
                            <div class="component-category">${componente.category}</div>
                        </div>
                        
                        <div class="component-description">${componente.description}</div>
                        
                        <div class="component-details">
                            <div class="component-detail">
                                <span class="detail-label">Marca</span>
                                <span class="detail-value">${componente.brand}</span>
                            </div>
                            <div class="component-detail">
                                <span class="detail-label">Fornecedor</span>
                                <span class="detail-value">${componente.supplier}</span>
                            </div>
                        </div>
                        
                        <div class="component-price">${formatarMoeda(componente.price)}</div>
                        
                        <div class="component-actions">
                            <button class="btn btn-warning btn-sm" onclick="editarComponente(${componente.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 20h9"/>
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                                </svg>
                                Editar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="confirmarExclusao(${componente.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"/>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                    <line x1="10" x2="10" y1="11" y2="17"/>
                                    <line x1="14" x2="14" y1="11" y2="17"/>
                                </svg>
                                Excluir
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

  container.innerHTML = html;
}

// Função para filtrar componentes
function filtrarComponentes() {
  const busca = document.getElementById('searchInput').value.toLowerCase();
  const categoria = document.getElementById('categoryFilter').value;

  let componentesFiltrados = componentes.filter(componente => {
    const correspondeTexto =
      componente.name.toLowerCase().includes(busca) ||
      componente.description.toLowerCase().includes(busca) ||
      componente.brand.toLowerCase().includes(busca) ||
      componente.supplier.toLowerCase().includes(busca);

    const correspondeCategoria = !categoria || componente.category === categoria;

    return correspondeTexto && correspondeCategoria;
  });

  renderizarComponentes(componentesFiltrados);
}

// Função para atualizar opções do filtro de categoria
function atualizarFiltroCategoria() {
  const categorias = [...new Set(componentes.map(c => c.category))].sort();
  const select = document.getElementById('categoryFilter');

  select.innerHTML = '<option value="">Todas as categorias</option>';
  categorias.forEach(categoria => {
    select.innerHTML += `<option value="${categoria}">${categoria}</option>`;
  });
}

// Modal functions
function abrirModal(componente = null) {
  const modal = document.getElementById('componentModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('componentForm');

  if (componente) {
    title.textContent = 'Editar Componente';
    componenteEditando = componente;
    preencherFormulario(componente);
  } else {
    title.textContent = 'Novo Componente';
    componenteEditando = null;
    form.reset();
    document.getElementById('componentId').value = '';
  }

  modal.style.display = 'block';
}

function fecharModal() {
  document.getElementById('componentModal').style.display = 'none';
  componenteEditando = null;
}

function preencherFormulario(componente) {
  document.getElementById('componentId').value = componente.id;
  document.getElementById('componentName').value = componente.name;
  document.getElementById('componentDescription').value = componente.description;
  document.getElementById('componentBrand').value = componente.brand;
  document.getElementById('componentPrice').value = componente.price;
  document.getElementById('componentSupplier').value = componente.supplier;
  document.getElementById('componentCategory').value = componente.category;
}

// Event listener para o formulário
document.getElementById('componentForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  await salvarComponente();
});

// Função para salvar componente (criar ou editar)
async function salvarComponente() {
  const dados = {
    name: document.getElementById('componentName').value.trim(),
    description: document.getElementById('componentDescription').value.trim(),
    brand: document.getElementById('componentBrand').value.trim(),
    price: parseFloat(document.getElementById('componentPrice').value),
    supplier: document.getElementById('componentSupplier').value.trim(),
    category: document.getElementById('componentCategory').value.trim()
  };

  // Validações
  if (campoVazio(dados.name) || campoVazio(dados.description) ||
    campoVazio(dados.brand) || campoVazio(dados.supplier) ||
    campoVazio(dados.category)) {
    mostrarAlerta('Todos os campos são obrigatórios!', 'error');
    return;
  }

  if (!ehNumeroPositivo(dados.price)) {
    mostrarAlerta('O preço deve ser um número positivo!', 'error');
    return;
  }

  try {
    const saveButton = document.getElementById('saveButton');
    saveButton.textContent = 'Salvando...';
    saveButton.disabled = true;

    if (componenteEditando) {
      // Editar componente existente
      await httpPut(`${API_URL}/${componenteEditando.id}`, dados);
      mostrarAlerta('Componente atualizado com sucesso!', 'success');
    } else {
      // Criar novo componente
      await httpPost(API_URL, dados);
      mostrarAlerta('Componente criado com sucesso!', 'success');
    }

    fecharModal();
    await carregarComponentes();
  } catch (erro) {
    console.error('Erro ao salvar componente:', erro);
    mostrarAlerta('Erro ao salvar componente. Tente novamente.', 'error');
  } finally {
    const saveButton = document.getElementById('saveButton');
    saveButton.textContent = 'Salvar';
    saveButton.disabled = false;
  }
}

// Função para editar componente
function editarComponente(id) {
  const componente = componentes.find(c => c.id === id);
  if (componente) {
    abrirModal(componente);
  }
}

// Função para confirmar exclusão
function confirmarExclusao(id) {
  const componente = componentes.find(c => c.id === id);
  if (componente && confirm(`Tem certeza que deseja excluir o componente "${componente.name}"?`)) {
    excluirComponente(id);
  }
}

// Função para excluir componente
async function excluirComponente(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    mostrarAlerta('Componente excluído com sucesso!', 'success');
    await carregarComponentes();
  } catch (erro) {
    console.error('Erro ao excluir componente:', erro);
    mostrarAlerta('Erro ao excluir componente. Tente novamente.', 'error');
  }
}

// Função para mostrar alertas
function mostrarAlerta(mensagem, tipo) {
  const container = document.getElementById('alertContainer');
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo}`;
  alertDiv.textContent = mensagem;

  container.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Fechar modal ao clicar fora dele
window.onclick = function (event) {
  const modal = document.getElementById('componentModal');
  if (event.target === modal) {
    fecharModal();
  }
}