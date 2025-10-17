import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Home,
  Lock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Input from "../shared/Input";
import Button from "../shared/Button";
import AuthLayout from "../shared/AuthLayout";
import {
  validateCPF,
  isValidDate,
  formatCPF,
  formatDate,
} from "../../utils/validation";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    cpf: "",
    birthdate: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const totalSteps = 3;

  const validateField = (name, value) => {
    switch (name) {
      case "name":
      case "lastname":
        if (!value.trim())
          return `${name === "name" ? "Nome" : "Sobrenome"} é obrigatório`;
        if (value.length < 2)
          return `${
            name === "name" ? "Nome" : "Sobrenome"
          } deve ter pelo menos 2 caracteres`;
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value))
          return `${
            name === "name" ? "Nome" : "Sobrenome"
          } deve conter apenas letras`;
        return "";
      case "cpf":
        if (!value) return "CPF é obrigatório";
        if (value.length < 14) return "CPF incompleto";
        if (!validateCPF(value)) return "CPF inválido";
        return "";
      case "birthdate":
        if (!value) return "Data de nascimento é obrigatória";
        if (value.length < 10) return "Data incompleta";
        if (!isValidDate(value)) return "Data inválida";
        return "";
      case "address":
        if (!value.trim()) return "Endereço é obrigatório";
        if (value.length < 10) return "Endereço deve ser mais detalhado";
        return "";
      case "password":
        if (!value) return "Senha é obrigatória";
        if (value.length < 6) return "Senha deve ter pelo menos 6 caracteres";
        return "";
      case "confirmPassword":
        if (!value) return "Confirmação de senha é obrigatória";
        if (value !== formData.password) return "Senhas não coincidem";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Apply formatting
    if (name === "cpf") {
      value = formatCPF(value);
    } else if (name === "birthdate") {
      value = formatDate(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate confirm password when password changes
    if (name === "password" && formData.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validateCurrentStep = () => {
    const fieldsToValidate = {
      1: ["name", "lastname", "cpf", "birthdate"],
      2: ["address"],
      3: ["password", "confirmPassword"],
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

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Por favor, corrija os erros antes de continuar.");
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      const result = await register({
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        cpf: formData.cpf,
        birthdate: formData.birthdate,
        address: formData.address.trim(),
        password: formData.password,
      });

      if (result.success) {
        toast.success(
          "Conta criada com sucesso! Redirecionando para o login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
        ${
          isCompleted
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
    <div className="flex items-center justify-center pt-6">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex items-center gap-2 pb-5">
          <StepIndicator
            step={step}
            isActive={step === currentStep}
            isCompleted={step < currentStep}
          />
          {index < 2 && (
            <div
              className={`
              w-12 h-0.5 mx-2 transition-colors duration-200
              ${step < currentStep ? "bg-green-600" : "bg-gray-200"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-2">
            <div className="text-center mb-8 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 mb-3">
                <User className="h-5 w-5 text-slate-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Informações Pessoais
                </h2>
              </div>
              <p className="text-gray-600">Conte-nos um pouco sobre você</p>
            </div>

            <div className="space-y-6 mb-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="CPF *"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  error={errors.cpf}
                  maxLength={14}
                  required
                />

                <Input
                  label="Data de Nascimento *"
                  name="birthdate"
                  placeholder="dd/mm/aaaa"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  error={errors.birthdate}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-5">
              <Button onClick={nextStep} variant="primary" size="sm">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-2">
            <div className="text-center gap-3">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Home className="h-5 w-5 text-slate-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Onde você mora?
                </h2>
              </div>
              <p className="text-gray-600">
                Precisamos do seu endereço para o cadastro
              </p>
            </div>

            <div className="pt-4">
              <Input
                label="Endereço Completo *"
                name="address"
                placeholder="Rua, número, bairro, cidade, estado"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                autoComplete="street-address"
                required
              />
            </div>

            <div className="flex justify-between pt-6">
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
          <div className="flex flex-col gap-2">
            <div className="text-center pt-3 pb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-slate-900" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Defina sua Senha
                </h2>
              </div>
              <p className="text-gray-600">
                Crie uma senha segura para proteger sua conta
              </p>
            </div>

            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    <AuthLayout maxWidth="lg">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col gap-3">
        <h1 className="text-gray-900 text-2xl font-bold mb-3 flex items-center justify-center gap-3">
          <UserPlus className="h-7 w-7" />
          Criar Conta
        </h1>
        <p className="text-gray-600">Preencha os dados para criar sua conta</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <StepProgress />
      </div>

      {/* Current Step */}
      {renderStep()}

      {/* Footer */}
      <div className="text-center mt-6 pt-6 border-t border-gray-100">
        <p className="text-gray-600 text-sm">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-slate-900 hover:text-slate-700 font-medium transition-colors"
          >
            Faça login aqui
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
