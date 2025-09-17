function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
}

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
