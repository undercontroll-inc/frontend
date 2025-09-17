const API_URL = 'http://localhost:3000/user';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    setupPasswordToggle();
    setupFormValidation();
    setupFormSubmission();
}

// Configurar toggle de senha
function setupPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const eyeIcon = passwordToggle.querySelector('.eye-icon');
    const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');

    passwordToggle.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.style.display = isPassword ? 'none' : 'block';
        eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    });
}

// Validação em tempo real
function setupFormValidation() {
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');

    nameInput.addEventListener('input', validateName);
    passwordInput.addEventListener('input', validatePassword);
}

function validateName() {
    const nameInput = document.getElementById('name');
    const value = nameInput.value.trim();
    
    if (value.length === 0) {
        setFieldError(nameInput, 'Nome é obrigatório');
        return false;
    } else if (value.length < 2) {
        setFieldError(nameInput, 'Nome deve ter pelo menos 2 caracteres');
        return false;
    } else {
        setFieldSuccess(nameInput);
        return true;
    }
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const value = passwordInput.value;
    
    if (value.length === 0) {
        setFieldError(passwordInput, 'Senha é obrigatória');
        return false;
    } else if (value.length < 3) {
        setFieldError(passwordInput, 'Senha deve ter pelo menos 3 caracteres');
        return false;
    } else {
        setFieldSuccess(passwordInput);
        return true;
    }
}

function setFieldError(input, message) {
    input.style.borderColor = '#dc2626';
    input.style.boxShadow = '0 0 0 2px rgb(220 38 38 / 0.1)';
}

function setFieldSuccess(input) {
    input.style.borderColor = '#16a34a';
    input.style.boxShadow = '0 0 0 2px rgb(22 163 74 / 0.1)';
}

function resetFieldStyle(input) {
    input.style.borderColor = '#e4e4e7';
    input.style.boxShadow = '';
}

// Configurar envio do formulário
function setupFormSubmission() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    
    // Validar campos
    const isNameValid = validateName();
    const isPasswordValid = validatePassword();
    
    if (!isNameValid || !isPasswordValid) {
        mostrarAlerta('Por favor, corrija os erros antes de continuar.', 'error');
        return;
    }
    
    const dados = {
        name: nameInput.value.trim(),
        password: passwordInput.value
    };
    
    try {
        // Loading state
        setLoadingState(loginButton, true);
        
        // Buscar usuários
        const usuarios = await httpGet(API_URL);
        
        // Verificar credenciais
        const usuarioEncontrado = usuarios.find(user => 
            user.name === dados.name && user.password === dados.password
        );
        
        if (usuarioEncontrado) {
            // Login bem-sucedido
            salvarToken(`token_${usuarioEncontrado.id}`);
            mostrarAlerta(`Bem-vindo, ${usuarioEncontrado.name}!`, 'success');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'componentes.html';
            }, 2000);
            
        } else {
            // Credenciais inválidas
            mostrarAlerta('Nome de usuário ou senha incorretos!', 'error');
            
            // Shake animation
            const authCard = document.querySelector('.auth-card');
            authCard.classList.add('shake');
            setTimeout(() => authCard.classList.remove('shake'), 500);
            
            // Reset field styles
            resetFieldStyle(nameInput);
            resetFieldStyle(passwordInput);
        }
        
    } catch (erro) {
        console.error('Erro no login:', erro);
        mostrarAlerta('Erro ao fazer login. Verifique se o servidor está rodando.', 'error');
    } finally {
        setLoadingState(loginButton, false);
    }
}

// Gerenciar estado de loading do botão
function setLoadingState(button, isLoading) {
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (isLoading) {
        button.disabled = true;
        buttonText.textContent = 'Entrando...';
        spinner.style.display = 'inline-block';
    } else {
        button.disabled = false;
        buttonText.textContent = 'Entrar';
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