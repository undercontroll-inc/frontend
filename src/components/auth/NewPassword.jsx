import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Check, X, KeyRound } from "lucide-react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import ComeBack from "../shared/ComeBack";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/UserService";

export default function NewPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const { user, updateUser } = useAuth();

  const checkPasswordStrength = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      // Match any punctuation/symbol (avoids unnecessary escaping in the regex literal)
      special: /[^\w\s]/.test(password),
    };
  };

  const getPasswordStrengthLevel = () => {
    const checks = Object.values(passwordStrength).filter(Boolean).length;
    if (checks <= 2)
      return { level: "Fraca", color: "text-red-500", bgColor: "bg-red-500" };
    if (checks <= 3)
      return {
        level: "Média",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
      };
    if (checks <= 4)
      return { level: "Boa", color: "text-blue-500", bgColor: "bg-blue-500" };
    return { level: "Forte", color: "text-green-500", bgColor: "bg-green-500" };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    } else if (!passwordStrength.uppercase || !passwordStrength.lowercase) {
      newErrors.password = "A senha deve conter letras maiúsculas e minúsculas";
    } else if (!passwordStrength.number) {
      newErrors.password = "A senha deve conter pelo menos um número";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await userService.resetPassword(
        formData.password,
        user.id,
      );

      if (!response.success) {
        toast.error(
          response.data || "Erro ao redefinir senha. Tente novamente.",
        );

        throw new Error(response.error);
      }

      toast.success("Senha redefinida com sucesso!");

      user.inFirstLogin = false;

      updateUser(user);

      navigate("/login");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast.error(
        error.response?.data?.message ||
          "Erro ao redefinir senha. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const heroImage = new URL(
    "../../assets/images/banner_login.png",
    import.meta.url,
  ).href;

  return (
    <div className="min-h-screen w-full bg-[#041a2dec] flex items-center justify-center p-4">
      {/* Botão Voltar */}
      <div className="absolute top-8 left-8 z-10">
        <ComeBack
          variant="light"
          className="bg-white hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
          to="/"
        />
      </div>

      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Formulário (esquerda) */}
          <div className="px-6 sm:px-10 py-8 md:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                <KeyRound className="h-8 w-8" />
                <span>Nova Senha</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Este é seu primeiro login, precisamos registrar sua senha!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="text-gray-700 dark:text-gray-300" />
                  <span className="block text-md font-medium text-gray-700 dark:text-gray-300">
                    Nova Senha
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Digite sua nova senha"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}

                {/* Indicador de força da senha */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Força da senha:
                      </span>
                      <span
                        className={`text-sm font-semibold ${getPasswordStrengthLevel().color}`}
                      >
                        {getPasswordStrengthLevel().level}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded ${
                            Object.values(passwordStrength).filter(Boolean)
                              .length >= index
                              ? getPasswordStrengthLevel().bgColor
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div
                        className={`flex items-center gap-1 ${passwordStrength.length ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {passwordStrength.length ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${passwordStrength.uppercase ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {passwordStrength.uppercase ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>Letra maiúscula</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${passwordStrength.lowercase ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {passwordStrength.lowercase ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>Letra minúscula</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${passwordStrength.number ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {passwordStrength.number ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>Número</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 col-span-2 ${passwordStrength.special ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {passwordStrength.special ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>Caractere especial (!@#$%^&*...)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="text-gray-700 dark:text-gray-300" />
                  <span className="block text-md font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Senha
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirme sua nova senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </div>
            </form>
          </div>

          {/* Painel de imagem (direita) */}
          <div className="relative h-full w-full min-h-[600px] md:min-h-0">
            <img
              src={heroImage}
              alt="Nova Senha"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
