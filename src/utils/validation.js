export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf[10]);
};

export const isEmpty = (value) => {
  if (typeof value === 'number') return false;
  return !value || (typeof value === 'string' && value.trim() === '');
};

export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const isValidDate = (dateString) => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};

// Input formatting helpers
export const formatCPF = (value) => {
  let cpf = value.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
};

export const formatDate = (value) => {
  let date = value.replace(/\D/g, '');
  date = date.replace(/(\d{2})(\d)/, '$1/$2');
  date = date.replace(/(\d{2})(\d)/, '$1/$2');
  return date;
};

export const validatePhoneBR = (phone) => {
  // Aceita formatos: (99) 99999-9999 ou 99999-9999 ou 99999999999
  const regex = /^(\(?\d{2}\)?\s?)?(\d{4,5})[- ]?(\d{4})$/;
  return regex.test(phone);
};

export const formatPhoneBR = (value) => {
  let phone = value.replace(/\D/g, '');
  if (phone.length <= 10) {
    // (99) 9999-9999
    phone = phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    // (99) 99999-9999
    phone = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatCEP = (value) => {
  let cep = value.replace(/\D/g, '');
  cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
  return cep;
};

export const validateCEP = (cep) => {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8;
};