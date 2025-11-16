import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Home, Lock, CheckCircle, ChevronRight, ChevronLeft, UserPlus, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import GoogleButton from '../shared/GoogleButton';
import ComeBack from '../shared/ComeBack';
import GoogleAuthService from '../../services/GoogleAuthService';
import { userService } from '../../services/UserService';
import { saveToken, saveUserData } from '../../utils/auth';
import { validateCPF, formatCPF, validatePhoneBR, formatPhoneBR, formatCEP, validateCEP, validateEmail } from '../../utils/validation';
import { cepService } from '../../services/CepService';

const Register = () => {
  const location = useLocation();
  const googleData = location.state?.googleData;
  const fromGoogle = location.state?.fromGoogle || false;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: googleData?.name || '',
    lastname: googleData?.lastname || '',
    email: googleData?.email || '',
    avatar_url: googleData?.photoURL || null,
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [addressData, setAddressData] = useState(null);

  const { register, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const totalSteps = 3;

  useEffect(() => {
    document.title = "Irmãos Pelluci - Cadastro";
  }, []);

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
        return "";
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
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const userData = await GoogleAuthService.signInWithGoogle();

      // Tenta fazer login no backend com o token do Google
      const backendResult = await userService.googleAuth(userData.email, userData.idToken);

      if (backendResult.success) {
        // Usuário já existe no backend, faz login e redireciona
        const userDataToSave = {
          ...backendResult.data.user,
          avatar_url: backendResult.data.user.avatar_url || userData.photoURL
        };

        // Salva token e dados do usuário
        saveToken(backendResult.data.token);
        saveUserData(userDataToSave);

        // Atualiza o contexto de autenticação
        updateUser(userDataToSave);

        toast.success(`Bem-vindo de volta, ${backendResult.data.user.name}!`);
        setTimeout(() => {
          navigate("/repairs", { replace: true });
        }, 500);
      } else {
        // Usuário não existe no backend, preenche formulário
        setFormData(prev => ({
          ...prev,
          name: userData.name.split(" ")[0] || "",
          lastname: userData.name.split(" ").slice(1).join(" ") || "",
          email: userData.email,
          avatar_url: userData.photoURL || null,
        }));

        // Limpa erros dos campos preenchidos
        setErrors(prev => ({
          ...prev,
          name: "",
          lastname: "",
          email: "",
        }));

        toast.success("Dados do Google carregados! Complete seu cadastro.");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao fazer login com Google");
    } finally {
      setGoogleLoading(false);
    }
  }; const validateCurrentStep = () => {
    const fieldsToValidate = {
      1: ['name', 'lastname', 'email', 'cpf'],
      2: ['cep', 'numero', 'phone'],
      3: ['password', 'confirmPassword']
    };

    const fields = fieldsToValidate[currentStep];
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
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
      toast.error("Por favor, corrija os erros antes de continuar.");
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        avatar_url: formData.avatar_url || null,
        cpf: formData.cpf.trim() ? formData.cpf : null,
        phone: formData.phone.trim(),
        address: fullAddress,
        CEP: formData.cep.trim().replace("-", ""),
        password: formData.password
      });

      if (result.success) {
        toast.success(
          result.autoLogin
            ? "Conta criada com sucesso! Bem-vindo!"
            : "Conta criada com sucesso!"
        );

        setTimeout(() => {
          if (result.autoLogin) {
            // Se login automático funcionou, redireciona para repairs
            navigate("/repairs");
          } else {
            // Se não, vai para o login
            navigate("/login");
          }
        }, 1500);
      } else {
        toast.error(result.error);

        if (result.error.includes("CPF")) {
          setCurrentStep(1);
        }
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ step, isActive, isCompleted }) => {
    const icons = {
      1: User,
      2: Home,
      3: Lock,
    };

    const Icon = icons[step];

    return (
      <div
        className={`
        flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
        ${isCompleted
            ? "bg-green-600 text-white"
            : isActive
              ? "bg-slate-900 text-white"
              : "bg-gray-200 text-gray-500"
          }
      `}
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
    );
  };

  const StepProgress = () => (
    <div className="flex items-center justify-center mb-2.5">
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
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-4 mt-6">
                <User className="h-5 w-5 text-slate-900" />
                <h2 className="text-base font-semibold text-gray-900">Informações Pessoais</h2>
              </div>
              {/* <p className="text-xs text-gray-600">Preencha os dados para criar sua conta</p> */}
            </div>

            {/* Badge indicando dados do Google */}
            {fromGoogle && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Avatar do Google"
                    className="h-7 w-7 rounded-full flex-shrink-0 border-2 border-blue-300"
                  />
                ) : (
                  <svg className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900">Dados carregados do Google</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Seus dados foram preenchidos automaticamente{formData.avatar_url && ' (incluindo foto de perfil)'}. Complete as informações restantes.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2.5 mb-2.5">
              {/* Google Button - apenas se não veio do Google */}
              {!fromGoogle && (
                <>
                  <GoogleButton
                    onClick={handleGoogleSignup}
                    loading={googleLoading}
                    text="Cadastrar com Google"
                  />

                  <div className="relative my-2 mt-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500 text-xs">ou preencha manualmente</span>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 mt-4">
                <Input
                  label="Nome *"
                  name="name"
                  placeholder="Seu primeiro nome"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  autoComplete="given-name"
                  disabled={fromGoogle}
                  className={fromGoogle ? "bg-gray-50" : ""}
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
                  disabled={fromGoogle}
                  className={fromGoogle ? "bg-gray-50" : ""}
                  required
                />
              </div>

              <Input
                label="Email *"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                autoComplete="email"
                disabled={fromGoogle}
                className={fromGoogle ? "bg-gray-50" : ""}
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
                optional
              />
            </div>

            <div className="flex justify-end mt-6">
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
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-4 mt-6">
                <Home className="h-5 w-5 text-slate-900" />
                <h2 className="text-base font-semibold text-gray-900">Endereço e Contato</h2>
              </div>
            </div>

            <div className="space-y-2.5 mb-2.5 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
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

              {/* Container de endereço sempre visível */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 space-y-2">
                {loadingCep ? (
                  <div className="flex items-center gap-2 text-sm text-slate-900 py-2">
                    <MapPin className="h-4 w-4 animate-pulse" />
                    <span>Buscando endereço...</span>
                  </div>
                ) : addressData ? (
                  <>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-900 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Endereço encontrado:</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {addressData.logradouro}, {addressData.bairro}
                          <br />
                          {addressData.localidade} - {addressData.uf}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 pt-1">
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
                        optional
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2 py-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500">Aguardando CEP</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Digite um CEP válido para buscar o endereço automaticamente
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
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
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-4 mt-6">
                <Lock className="h-5 w-5 text-slate-900" />
                <h2 className="text-base font-semibold text-gray-900">Defina sua Senha</h2>
              </div>
            </div>

            {/* Dica de senha */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-gray-700">
                  <span className="font-medium text-slate-900">💡 Aviso:</span> Escolha uma senha com pelo menos <span className="font-medium text-slate-900">6 caracteres</span> para proteger sua conta!
                </p>
              </div>

            <div className="space-y-2.5 mb-2.5 mt-4">
              <Input
                label="Senha *"
                name="password"
                type="password"
                placeholder="Digite sua senha"
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
                placeholder="Repita sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
                required
              />

            </div>

            <div className="flex justify-between mt-6">
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
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#041a2dfa] flex items-center justify-center p-4 relative">
      {/* Botão Voltar */}
      <div className="absolute top-10 left-12 z-10">
        <ComeBack 
          variant="light" 
          className="hover:bg-gray-200" 
          to="/" 
        />
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="px-6 sm:px-10 py-5 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="text-center mb-4">
              <h1 className="text-2xl mt-1 mb-1 font-extrabold text-gray-900 flex items-center justify-center gap-2">
                <UserPlus className="h-7 w-7" />
                <span>Criar Conta</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Preencha os dados para criar sua conta
              </p>
            </div>

            <StepProgress />

            {renderStep()}

            <div className="text-center mt-5">
              <p className="text-gray-600 text-sm">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-slate-900 hover:text-slate-700 font-medium transition-colors"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;
