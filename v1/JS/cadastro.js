const API_URL = 'http://localhost:3000/user';
let currentStep = 1;
const totalSteps = 3;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeCadastro();
});

function initializeCadastro() {
    setupPasswordToggles();
    setupInputMasks();
    setupFormValidation();
    setupStepNavigation();
    updateStepDisplay();
}

// Configurar navegação entre etapas
function setupStepNavigation() {
    // Botões próximo
    document.getElementById('nextStep1').addEventListener('click', () => nextStep());
    document.getElementById('nextStep2').addEventListener('click', () => nextStep());
    
    // Botões anterior
    document.getElementById('prevStep2').addEventListener('click', () => prevStep());
    document.getElementById('prevStep3').addEventListener('click', () => prevStep());
    
    // Envio do formulário
    document.getElementById('cadastroForm').addEventListener('submit', handleCadastro);
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Atualizar indicadores de progresso
    for (let i = 1; i <= totalSteps; i++) {
        const indicator = document.querySelector(`[data-step="${i}"].step-indicator`);
        const connector = document.querySelectorAll('.step-connector')[i - 1];
        
        if (i < currentStep) {
            // Etapa concluída
            indicator.className = 'step-indicator completed';
            if (connector) connector.className = 'step-connector completed';
        } else if (i === currentStep) {
            // Etapa atual
            indicator.className = 'step-indicator active';
            if (connector) connector.className = 'step-connector';
        } else {
            // Etapa futura
            indicator.className = 'step-indicator inactive';
            if (connector) connector.className = 'step-connector';
        }
    }
    
    // Atualizar conteúdo das etapas
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-step="${currentStep}"].step-content`).classList.add('active');
    
    // Scroll suave para o topo
    document.querySelector('.auth-card').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

function validateCurrentStep() {
    let isValid = true;
    
    switch (currentStep) {
        case 1:
            isValid = validateName() && validateLastname() && validateCPF() && validateBirthdate();
            break;
        case 2:
            isValid = validateAddress();
            break;
        case 3:
            isValid = validatePassword() && validateConfirmPassword();
            break;
    }
    
    if (!isValid) {
        mostrarAlerta('Por favor, corrija os erros antes de continuar.', 'error');
    }
    
    return isValid;
}

// Configurar toggles de senha
function setupPasswordToggles() {
    setupPasswordToggle('passwordToggle', 'password');
    setupPasswordToggle('confirmPasswordToggle', 'confirmpassword');
}

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    const eyeIcon = toggle.querySelector('.eye-icon');
    const eyeOffIcon = toggle.querySelector('.eye-off-icon');

    toggle.addEventListener('click', function() {
        const isPassword = input.type === 'password';
        
        input.type = isPassword ? 'text' : 'password';
        eyeIcon.style.display = isPassword ? 'none' : 'block';
        eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    });
}

// Configurar máscaras de input
function setupInputMasks() {
    const cpfInput = document.getElementById('cpf');
    const birthdateInput = document.getElementById('birthdate');

    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
        validateCPF();
    });

    birthdateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '$1/$2');
        value = value.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = value;
        validateBirthdate();
    });
}

// Validação em tempo real
function setupFormValidation() {
    document.getElementById('name').addEventListener('input', validateName);
    document.getElementById('lastname').addEventListener('input', validateLastname);
    document.getElementById('cpf').addEventListener('input', validateCPF);
    document.getElementById('birthdate').addEventListener('input', validateBirthdate);
    document.getElementById('address').addEventListener('input', validateAddress);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmpassword').addEventListener('input', validateConfirmPassword);
}

function validateName() {
    const input = document.getElementById('name');
    const validation = document.getElementById('nameValidation');
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldError(input, validation, 'Nome é obrigatório');
        return false;
    } else if (value.length < 2) {
        setFieldError(input, validation, 'Nome deve ter pelo menos 2 caracteres');
        return false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
        setFieldError(input, validation, 'Nome deve conter apenas letras');
        return false;
    } else {
        setFieldSuccess(input, validation, '');
        return true;
    }
}

function validateLastname() {
    const input = document.getElementById('lastname');
    const validation = document.getElementById('lastnameValidation');
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldError(input, validation, 'Sobrenome é obrigatório');
        return false;
    } else if (value.length < 2) {
        setFieldError(input, validation, 'Sobrenome deve ter pelo menos 2 caracteres');
        return false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
        setFieldError(input, validation, 'Sobrenome deve conter apenas letras');
        return false;
    } else {
        setFieldSuccess(input, validation, '');
        return true;
    }
}

function validateCPF() {
    const input = document.getElementById('cpf');
    const validation = document.getElementById('cpfValidation');
    const value = input.value;
    
    if (value.length === 0) {
        setFieldError(input, validation, 'CPF é obrigatório');
        return false;
    } else if (value.length < 14) {
        setFieldError(input, validation, 'CPF incompleto');
        return false;
    } else if (!validarCPF(value)) {
        setFieldError(input, validation, 'CPF inválido');
        return false;
    } else {
        setFieldSuccess(input, validation, 'CPF válido');
        return true;
    }
}

function validateBirthdate() {
    const input = document.getElementById('birthdate');
    const validation = document.getElementById('birthdateValidation');
    const value = input.value;
    
    if (value.length === 0) {
        setFieldError(input, validation, 'Data de nascimento é obrigatória');
        return false;
    } else if (value.length < 10) {
        setFieldError(input, validation, 'Data incompleta');
        return false;
    } else if (!isValidDate(value)) {
        setFieldError(input, validation, 'Data inválida');
        return false;
    } else {
        setFieldSuccess(input, validation, '');
        return true;
    }
}

function validateAddress() {
    const input = document.getElementById('address');
    const validation = document.getElementById('addressValidation');
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldError(input, validation, 'Endereço é obrigatório');
        return false;
    } else if (value.length < 10) {
        setFieldError(input, validation, 'Endereço deve ser mais detalhado');
        return false;
    } else {
        setFieldSuccess(input, validation, '');
        return true;
    }
}

function validatePassword() {
    const input = document.getElementById('password');
    const validation = document.getElementById('passwordValidation');
    const value = input.value;
    
    if (value.length === 0) {
        setFieldError(input, validation, 'Senha é obrigatória');
        return false;
    } else if (value.length < 6) {
        setFieldError(input, validation, 'Senha deve ter pelo menos 6 caracteres');
        return false;
    } else {
        setFieldSuccess(input, validation, 'Senha válida');
        // Revalidar confirmação se já preenchida
        if (document.getElementById('confirmpassword').value) {
            validateConfirmPassword();
        }
        return true;
    }
}

function validateConfirmPassword() {
    const input = document.getElementById('confirmpassword');
    const validation = document.getElementById('confirmPasswordValidation');
    const value = input.value;
    const password = document.getElementById('password').value;
    
    if (value.length === 0) {
        setFieldError(input, validation, 'Confirmação de senha é obrigatória');
        return false;
    } else if (value !== password) {
        setFieldError(input, validation, 'Senhas não coincidem');
        return false;
    } else {
        setFieldSuccess(input, validation, 'Senhas coincidem');
        return true;
    }
}

// Funções auxiliares de validação
function isValidDate(dateString) {
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
}

function setFieldError(input, validation, message) {
    input.style.borderColor = '#dc2626';
    input.style.boxShadow = '0 0 0 2px rgb(220 38 38 / 0.1)';
    validation.textContent = message;
    validation.className = 'validation-message';
}

function setFieldSuccess(input, validation, message) {
    input.style.borderColor = '#16a34a';
    input.style.boxShadow = '0 0 0 2px rgb(22 163 74 / 0.1)';
    validation.textContent = message;
    validation.className = 'validation-message success';
}

function resetFieldStyle(input, validation) {
    input.style.borderColor = '#e4e4e7';
    input.style.boxShadow = '';
    validation.textContent = '';
}

// Envio do formulário final
async function handleCadastro(event) {
    event.preventDefault();
    
    const cadastroButton = document.getElementById('cadastroButton');
    
    // Validar etapa atual (deveria ser a 3)
    if (!validateCurrentStep()) {
        return;
    }
    
    const dados = {
        name: document.getElementById('name').value.trim(),
        lastname: document.getElementById('lastname').value.trim(),
        cpf: document.getElementById('cpf').value,
        birthdate: document.getElementById('birthdate').value,
        address: document.getElementById('address').value.trim(),
        password: document.getElementById('password').value,
        userType: "COSTUMER"
    };
    
    try {
        // Loading state
        setLoadingState(cadastroButton, true);
        
        // Verificar se CPF já existe
        const usuarios = await httpGet(API_URL);
        const cpfExiste = usuarios.some(user => user.cpf === dados.cpf);
        
        if (cpfExiste) {
            mostrarAlerta('CPF já cadastrado no sistema!', 'error');
            // Voltar para a etapa 1 onde está o CPF
            currentStep = 1;
            updateStepDisplay();
            return;
        }
        
        // Criar usuário
        await httpPost(API_URL, dados);
        
        mostrarAlerta('Conta criada com sucesso! Redirecionando para o login...', 'success');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        mostrarAlerta('Erro ao criar conta. Verifique se o servidor está rodando.', 'error');
    } finally {
        setLoadingState(cadastroButton, false);
    }
}

// Gerenciar estado de loading do botão
function setLoadingState(button, isLoading) {
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (isLoading) {
        button.disabled = true;
        buttonText.textContent = 'Criando conta...';
        spinner.style.display = 'inline-block';
    } else {
        button.disabled = false;
        buttonText.textContent = 'Criar Conta';
        spinner.style.display = 'none';
    }
}

// Função para mostrar alertas
function mostrarAlerta(mensagem, tipo) {
    const container = document.getElementById('alertContainer');
    
    // Remove alertas anteriores
    container.innerHTML = '';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} fade-in`;
    
    // Ícone baseado no tipo
    let iconSvg = '';
    if (tipo === 'success') {
        iconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
        `;
    } else if (tipo === 'error') {
        iconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" x2="9" y1="9" y2="15"/>
                <line x1="9" x2="15" y1="9" y2="15"/>
            </svg>
        `;
    }
    
    alertDiv.innerHTML = `${iconSvg}<span>${mensagem}</span>`;
    container.appendChild(alertDiv);
    
    // Remove o alerta após 5 segundos (apenas para erros)
    if (tipo === 'error') {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}