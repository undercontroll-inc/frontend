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


