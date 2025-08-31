// 1. ====== VALIDAÇÃO DE DADOS ======

// Verifica se é um email válido
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Verifica se é um CPF válido (11 dígitos)
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

// Verifica se um campo está vazio
function campoVazio(valor) {
  return !valor || valor.trim() === '';
}

// Verifica se é número positivo
function ehNumeroPositivo(valor) {
  const num = Number(valor);
  return !isNaN(num) && num > 0;
}


// 2. ====== MANIPULAÇÃO DE DADOS ======


// Limpa todos os campos de um formulário
function limparFormulario(idForm) {
  const form = document.getElementById(idForm);
  if (form) form.reset();
}

// Preenche um formulário com dados (ex: editar perfil)
function preencherForm(dados) {
  for (const [campo, valor] of Object.entries(dados)) {
    const input = document.getElementById(campo);
    if (input) input.value = valor;
  }
}


// 3. ====== INTERAÇÃO COM API E TOKEN ======

// Pega o token do usuário logado
function getToken() {
  return localStorage.getItem('authToken');
}

// Verifica se o usuário está logado
function estaLogado() {
  return !!getToken();
}

// Salva o token após login
function salvarToken(token) {
  localStorage.setItem('authToken', token);
}

// Remove o token ao sair
function removerToken() {
  localStorage.removeItem('authToken');
}

// Configura headers para requisições autenticadas
function headersAutenticados() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}


// 4. ====== REQUISIÇÕES ASSÍNCRONAS (FETCH) ======

// Função genérica para fazer GET
async function httpGet(url) {
  try {
    const resposta = await fetch(url, {
      method: 'GET',
      headers: headersAutenticados()
    });
    if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
    return await resposta.json();
  } catch (erro) {
    console.error('Erro no GET:', erro);
    throw erro;
  }
}

// Função genérica para POST/PUT
async function httpPost(url, dados, metodo = 'POST') {
  try {
    const resposta = await fetch(url, {
      method,
      headers: headersAutenticados(),
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
    return await resposta.json();
  } catch (erro) {
    console.error(`Erro no ${metodo}:`, erro);
    throw erro;
  }
}

// Atalho para PUT
async function httpPut(url, dados) {
  return httpPost(url, dados, 'PUT');
}


// 5. ====== MANIPULAÇÃO DE DATAS ======

// Formata data para PT-BR (dd/mm/aaaa)
function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR');
}

// Retorna data atual no formato YYYY-MM-DD (para inputs)
function dataHoje() {
  const hoje = new Date();
  return hoje.toISOString().split('T')[0];
}


// 6. ====== OUTRAS FUNÇÕES ÚTEIS ======

// Formata valor monetário
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
}