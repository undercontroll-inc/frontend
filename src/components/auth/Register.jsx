import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Home, Lock, CheckCircle, ChevronRight, ChevronLeft, UserPlus, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { validateCPF, formatCPF, validatePhoneBR, formatPhoneBR, formatCEP, validateCEP, validateEmail } from '../../utils/validation';
import { cepService } from '../../services/CepService';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    cpf: '',
    cep: '',
    numero: '',
    complemento: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [addressData, setAddressData] = useState(null);
  
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const totalSteps = 3;

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'lastname':
        if (!value.trim()) return `${name === 'name' ? 'Nome' : 'Sobrenome'} é obrigatório`;
        if (value.length < 2) return `${name === 'name' ? 'Nome' : 'Sobrenome'} deve ter pelo menos 2 caracteres`;
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return `${name === 'name' ? 'Nome' : 'Sobrenome'} deve conter apenas letras`;
        return '';
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        if (!validateEmail(value)) return 'Email inválido';
        return '';
      case 'cpf':
        if (!value) return '';
        if (value && value.length < 14) return 'CPF incompleto';
        if (value && !validateCPF(value)) return 'CPF inválido';
        return '';
      case 'cep':
        if (!value.trim()) return 'CEP é obrigatório';
        if (!validateCEP(value)) return 'CEP inválido';
        return '';
      case 'numero':
        if (!value.trim()) return 'Número é obrigatório';
        return '';
      case 'phone':
        if (!value.trim()) return 'Telefone é obrigatório';
        if (!validatePhoneBR(value)) return 'Telefone inválido';
        return '';
      case 'password':
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirmação de senha é obrigatória';
        if (value !== formData.password) return 'Senhas não coincidem';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cpf') {
      value = formatCPF(value);
    } else if (name === 'phone') {
      value = formatPhoneBR(value);
    } else if (name === 'cep') {
      value = formatCEP(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleCepBlur = async () => {
    const cepValue = formData.cep;
    
    if (!cepValue || cepValue.replace(/\D/g, '').length !== 8) {
      return;
    }

    setLoadingCep(true);
    
    try {
      const result = await cepService.getAddressByCep(cepValue);
      
      if (result.success) {
        setAddressData(result.data);
        setErrors(prev => ({ ...prev, cep: '' }));
      } else {
        setAddressData(null);
        setErrors(prev => ({ ...prev, cep: result.error }));
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  const validateCurrentStep = () => {
    const fieldsToValidate = {
      1: ['name', 'lastname', 'email', 'cpf'],
      2: ['cep', 'numero', 'phone'],
      3: ['password', 'confirmPassword']
    };

    const fields = fieldsToValidate[currentStep];
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    if (currentStep === 2 && !addressData) {
      newErrors.cep = 'Busque um CEP válido';
      isValid = false;
    }

    setErrors(newErrors);
    
    if (!isValid) {
      toast.error('Por favor, corrija os erros antes de continuar.');
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;

    setLoading(true);

    try {
      const fullAddress = [
        addressData.logradouro,
        formData.numero,
        formData.complemento,
        addressData.bairro,
        addressData.localidade,
        addressData.uf
      ].filter(Boolean).join(', ');

      const result = await register({
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        cpf: formData.cpf.trim() ? formData.cpf : null,
        phone: formData.phone.trim(),
        address: fullAddress,
        CEP: formData.cep.trim().replace("-", ""),
        password: formData.password
      });

      if (result.success) {
        toast.success('Conta criada com sucesso! Redirecionando para o login...');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(result.error);
        
        if (result.error.includes('CPF')) {
          setCurrentStep(1);
        }
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ step, isActive, isCompleted }) => {
    const icons = {
      1: User,
      2: Home,
      3: Lock
    };
    
    const Icon = icons[step];
    
    return (
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
        ${isCompleted 
          ? 'bg-green-600 text-white' 
          : isActive 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-500'
        }
      `}>
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>
    );
  };

  const StepProgress = () => (
    <div className="flex items-center justify-center mb-4">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center">
          <StepIndicator 
            step={step}
            isActive={step === currentStep}
            isCompleted={step < currentStep}
          />
          {index < 2 && (
            <div className={`
              w-10 sm:w-12 h-0.5 mx-2 transition-colors duration-200
              ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Informações Pessoais</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Conte-nos um pouco sobre você</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Nome *"
                  name="name"
                  placeholder="Seu primeiro nome"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  autoComplete="given-name"
                  required
                />
                
                <Input
                  label="Sobrenome *"
                  name="lastname"
                  placeholder="Seu sobrenome"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  error={errors.lastname}
                  autoComplete="family-name"
                  required
                />
              </div>
              
              <Input
                label="Email *"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                autoComplete="email"
                required
              />
              
              <Input
                label="CPF"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleInputChange}
                error={errors.cpf}
                maxLength={14}
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={nextStep} variant="primary" size="sm">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Endereço e Contato</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Informe seu endereço e telefone</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="CEP *"
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCepBlur}
                  error={errors.cep}
                  maxLength={9}
                  required
                  disabled={loadingCep}
                />
                
                <Input
                  label="Telefone *"
                  name="phone"
                  placeholder="(99) 99999-9999"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  required
                />
              </div>

              {loadingCep && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <MapPin className="h-4 w-4 animate-pulse" />
                  <span>Buscando endereço...</span>
                </div>
              )}

              {addressData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">Endereço encontrado:</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        {addressData.logradouro}, {addressData.bairro}
                        <br />
                        {addressData.localidade} - {addressData.uf}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                    <Input
                      label="Número *"
                      name="numero"
                      placeholder="123"
                      value={formData.numero}
                      onChange={handleInputChange}
                      error={errors.numero}
                      required
                    />
                    
                    <Input
                      label="Complemento"
                      name="complemento"
                      placeholder="Apto, Bloco, etc"
                      value={formData.complemento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button onClick={nextStep} variant="primary" size="sm">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Defina sua Senha</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Crie uma senha segura para proteger sua conta</p>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Senha *"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  autoComplete="new-password"
                  required
                />
                
                <Input
                  label="Confirmar Senha *"
                  name="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button 
                onClick={handleSubmit} 
                variant="primary"
                size="sm"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg my-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
            <div className="text-center mb-4">
              <h1 className="text-blue-700 text-xl sm:text-2xl font-bold mb-1 flex items-center justify-center gap-2">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
                Criar Conta
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Preencha os dados para criar sua conta</p>
            </div>

            <StepProgress />

            {renderStep()}

            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-xs sm:text-sm">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;