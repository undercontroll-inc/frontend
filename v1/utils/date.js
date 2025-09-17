function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR');
}

// Retorna data atual no formato YYYY-MM-DD (para inputs)
function dataHoje() {
  const hoje = new Date();
  return hoje.toISOString().split('T')[0];
}


