import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Input from "../shared/Input";
import Button from "../shared/Button";
import GoogleButton from "../shared/GoogleButton";
import ComeBack from "../shared/ComeBack";
import GoogleAuthService from "../../services/GoogleAuthService";
import { userService } from "../../services/UserService";
import { saveToken, saveUserData } from "../../utils/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // Single image (no carousel)

  const { login, isAuthenticated, user, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const dest = user?.userType === "ADMIN" ? "/dashboard" : "/repairs";
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    document.title = "Irmãos Pelluci - Login";
  }, []);

  const heroImage = new URL("../../assets/images/banner_login.png", import.meta.url).href;

  const validateField = (name, value) => {
    // O correto seria enviar como "email" para o backend, mas o sistema usa nome de usuário
    switch (name) {
      case "name":
        if (!value.trim()) return "O e-mail é obrigatório";
        // if (value.length < 2) return "Nome deve ter pelo menos 2 caracteres";
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const userData = await GoogleAuthService.signInWithGoogle();

      // Tenta fazer login no backend com o token do Google
      const backendResult = await userService.googleAuth(
        userData.email,
        userData.idToken
      );

      if (backendResult.success) {
        // Usuário já existe no backend, faz login usando o contexto
        const userDataToSave = {
          ...backendResult.data.user,
          avatar_url: backendResult.data.user.avatar_url || userData.photoURL,
        };

        // Salva token e dados do usuário
        saveToken(backendResult.data.token);
        saveUserData(userDataToSave);

        // Atualiza o contexto de autenticação
        updateUser(userDataToSave);

        toast.success(`Bem-vindo de volta, ${backendResult.data.user.name}!`);

        // Redireciona para repairs após um curto delay
        setTimeout(() => {
          navigate("/repairs", { replace: true });
        }, 500);
      } else {
        // Usuário não existe no backend, redireciona para registro
        navigate("/register", {
          state: {
            fromGoogle: true,
            googleData: {
              name: userData.name.split(" ")[0] || "",
              lastname: userData.name.split(" ").slice(1).join(" ") || "",
              email: userData.email,
              photoURL: userData.photoURL,
              uid: userData.uid,
              idToken: userData.idToken,
            },
          },
        });

        toast.success("Dados do Google carregados! Complete seu cadastro.");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao fazer login com Google");
    } finally {
      setGoogleLoading(false);
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
        
        
        const isAdmin = result.user?.userType === "ADMIN";

        setTimeout(() => {
          const dest =
             isAdmin ? "/dashboard" : "/repairs";
          navigate(dest);
        }, 500);
      } else {
        toast.error("Email ou senhas invalidos");
        const form = document.querySelector("form");
        form.classList.add("animate-pulse");
        setTimeout(() => form.classList.remove("animate-pulse"), 500);
      }
    } catch (error) {
      toast.error("Erro inesperado: " + error);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Painel de imagem (esquerda) */}
          <div className="relative h-full w-full">
            <img
              src={heroImage}
              alt="Login Hero"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Overlay suave */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" /> */}
          </div>

          {/* Formulário (direita) */}
          <div className="px-6 sm:px-10 py-8 md:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-center">
                <span>Bem-vindo de volta</span>
                <span role="img" aria-label="Waving Hand">
                  👋
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                Insira seus dados para entrar
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-gray-700 dark:text-gray-300 mb-2" />
                  <span className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-mail
                  </span>
                </div>
                <Input
                  name="name"
                  type="text"
                  placeholder="Digite seu e-mail"
                  value={formData.name}
                  onChange={handleInputChange}
                  // error={errors.name}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-auto h-5 text-gray-700 dark:text-gray-300 mb-2" />
                  <span className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Senha
                  </span>
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
                  className="w-full hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  loading={loading}
                  disabled={loading || googleLoading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                <span className="text-sm text-gray-500 dark:text-gray-400">ou</span>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
              </div>

              {/* Botão Google abaixo do Entrar */}
              <div className="pt-1">
                <GoogleButton
                  onClick={handleGoogleLogin}
                  loading={googleLoading}
                  text="Continuar com Google"
                  className="hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                />
              </div>
            </form>

            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="text-slate-900 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-400 font-medium transition-colors"
                >
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
