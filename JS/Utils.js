// 1. ====== VALIDAÇÃO DE DADOS ======




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

// Formata data para PT-BR (dd/mm/aaaa)

// 6. ====== OUTRAS FUNÇÕES ÚTEIS ======

// Formata valor monetário

