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
      method: metodo,
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


