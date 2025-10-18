import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Wrench } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Input from "../shared/Input";
import Button from "../shared/Button";
import AuthLayout from "../shared/AuthLayout";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const dest = user?.userType === "ADMIN" ? "/dashboard" : "/repairs";
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.length < 2) return "Nome deve ter pelo menos 2 caracteres";
        return "";
      case "password":
        if (!value) return "Senha é obrigatória";
        if (value.length < 3) return "Senha deve ter pelo menos 3 caracteres";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, corrija os erros antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        toast.success(`Bem-vindo, ${result.user.name}!`);
        setTimeout(() => {
          const dest =
            result.user?.userType === "ADMIN" ? "/dashboard" : "/repairs";
          navigate(dest);
        }, 500);
      } else {
        toast.error("Email ou senhas invalidos");
        const form = document.querySelector('form');
        form.classList.add('animate-pulse');
        setTimeout(() => form.classList.remove('animate-pulse'), 500);
      }
    } catch (error) {
      toast.error('Erro inesperado: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full my-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8">
            <div className="text-center mb-6">
              <h1 className="text-blue-700 text-xl sm:text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Wrench className="h-6 w-6 sm:h-7 sm:w-7" />
                Entrar
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Acesse sua conta</p>
            </div>

            <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Usuário</span>
              </div>
              <Input
                name="name"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Senha</span>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center mt-auto pt-6 border-t border-gray-100">
        <p className="text-gray-600 text-sm">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-slate-900 hover:text-slate-700 font-medium transition-colors"
          >
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
