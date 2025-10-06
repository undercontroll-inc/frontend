import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Home,
  Wrench,
  Briefcase,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/api";
import Loading from "../shared/Loading";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Alert from "../shared/Alert";

const statusStyles = {
  EM_ANDAMENTO: {
    bg: "bg-transparent",
    text: "text-yellow-400",
    border: "border border-yellow-400",
    label: "Em Andamento",
    icon: <Clock className="h-4 w-4" />,
  },
  FINALIZADO: {
    bg: "bg-transparent",
    text: "text-green-400",
    border: "border border-green-400",
    label: "Finalizado",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  NAO_INICIADO: {
    bg: "bg-transparent",
    text: "text-red-400",
    border: "border border-red-400",
    label: "Não Iniciado",
    icon: null,
  },
};

const formatCurrency = (v) => {
  if (v == null) return "-";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatUpdatedAt = (s) => {
  if (!s) return null;
  if (typeof s !== "string") return String(s);
  return s.includes("T") ? s.replace("T", " ") : s;
};

const ComponentRepair = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    loadRepairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      let data = [];

      if (user?.id) {
        try {
          data = await apiService.get(`/repairs?userId=${user.id}`);
        } catch (err) {
          data = await apiService.get("/repairs");
        }
      } else {
        data = await apiService.get("/repairs");
      }

      if (!Array.isArray(data)) data = [];
      setRepairs(data.reverse());
    } catch (error) {
      console.error("Erro ao carregar consertos:", error);
      setAlert({
        type: "error",
        message: "Erro ao carregar consertos. Verifique o servidor.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filtered = repairs.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    if (statusFilter && r.status !== statusFilter) return false;
    if (!term) return true;
    return (
      (r.deviceType || "").toLowerCase().includes(term) ||
      (r.brand || "").toLowerCase().includes(term) ||
      (r.model || "").toLowerCase().includes(term) ||
      (r.serial || "").toLowerCase().includes(term)
    );
  });

  if (loading) return <Loading text="Carregando consertos..." />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-400 text-white flex flex-col">
        {/* User Info */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {user?.name || "Usuário"}
              </div>
              <div className="text-sm text-gray-900">
                {user?.name
                  ? `${user.name.toLowerCase()}@email.com`
                  : "email@email.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-800 hover:text-white transition-colors text-gray-900"
          >
            <Home className="h-5 w-5" />
            <span>Início</span>
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-3 text-left bg-slate-900 text-white">
            <Wrench className="h-5 w-5" />
            <span>Consertos</span>
          </button>
          <button
            onClick={() => navigate("/orcamentos")}
            className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-800 hover:text-white transition-colors text-gray-900"
          >
            <Briefcase className="h-5 w-5" />
            <span>Visita Técnica</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-800 hover:text-white transition-colors rounded text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Encerrar sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen p-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between pb-10">
            <h1 className="text-3xl font-bold text-gray-900">Consertos</h1>
            <div className="flex items-center gap-3 w-full max-w-2xl">
              <div className="w-41 relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-600 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-100   appearance-none cursor-pointer"
                >
                  <option value="">Status: Todos</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="NAO_INICIADO">Não Iniciado</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar por: Tipo do aparelho, marca ou modelo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
            </div>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum conserto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Não há registros de conserto para os filtros selecionados.
              </p>
              <Button onClick={() => setStatusFilter("")} variant="primary">
                Mostrar todos
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filtered.map((r) => {
                const status =
                  statusStyles[r.status] || statusStyles["NAO_INICIADO"];
                return (
                  <div
                    key={r.id}
                    className="bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden"
                  >
                    {/* Cabeçalho do card */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5" />
                        <div className="text-sm font-medium">
                          Ordem de Serviço:
                        </div>
                        <div className="font-semibold">#{`A${r.id}`}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Status:</span>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} ${status.border} flex items-center gap-1`}
                          >
                            {status.icon}
                            {status.label}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          Atualizado em:{" "}
                          {formatUpdatedAt(r.updatedAt || r.updated) || "-"}
                        </div>
                        <button
                          onClick={() => toggleExpand(r.id)}
                          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              expanded[r.id] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Visualização compacta (não expandido) */}
                    {!expanded[r.id] && (
                      <div className="p-4 bg-gray-300 grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-sm text-gray-900 font-bold mb-1">
                            Tipo do aparelho:
                          </div>
                          <div className="text-gray-900">
                            {r.deviceType || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 font-bold mb-1">
                            Marca:
                          </div>
                          <div className="text-gray-900">{r.brand || "-"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 font-bold mb-1">
                            Serviço realizado:
                          </div>
                          <div className="text-gray-900">
                            {r.serviceDone || "-"}
                          </div>
                        </div>
                        {/* Condicional: Se FINALIZADO mostra Data de retirada, senão mostra Valor */}
                        {r.status === "FINALIZADO" ? (
                          <div>
                            <div className="text-sm text-gray-900 font-bold mb-1">
                              Data de retirada:
                            </div>
                            <div className="text-gray-900">
                              {r.deadline || "-"}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-900 font-bold mb-1">
                              Valor:
                            </div>
                            <div className="text-gray-900">
                              {formatCurrency(r.value)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Corpo expandido*/}
                    {expanded[r.id] && (
                      <div className="p-6 bg-gray-300 grid grid-cols-1 md:grid-cols-4 gap-6 divide-x divide-gray-900">
                        {/* Coluna 1: Informações do aparelho */}
                        <div className="space-y-3 pr-4">
                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Tipo do aparelho:
                            </div>
                            <div className="text-gray-900">
                              {r.deviceType || "-"}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Marca:
                            </div>
                            <div className="text-gray-900">
                              {r.brand || "-"}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Modelo:
                            </div>
                            <div className="text-gray-900">
                              {r.model || "-"}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Número de série:
                            </div>
                            <div className="text-gray-900">
                              {r.serial || "-"}
                            </div>
                          </div>
                        </div>

                        {/* Coluna 2: Diagnóstico e Serviço */}
                        <div className="space-y-3 px-4">
                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Diagnóstico:
                            </div>
                            <div className="text-gray-900 whitespace-pre-wrap">
                              {r.diagnosis || "-"}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Serviço realizado:
                            </div>
                            <div className="text-gray-900">
                              {r.serviceDone || "-"}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Peças substituídas:
                            </div>
                            <div className="text-gray-900">
                              {(r.parts && r.parts.join(", ")) || "-"}
                            </div>
                          </div>
                        </div>

                        {/* Coluna 3: Datas e Valores */}
                        <div className="space-y-3 px-4">
                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Recebimento:
                            </div>
                            <div className="text-gray-900">
                              {r.receivedAt || "-"}
                            </div>
                          </div>

                          {/* Condicional: Se FINALIZADO mostra Data de retirada, senão mostra Valor */}
                          {r.status === "FINALIZADO" ? (
                            <div>
                              <div className="text-sm text-gray-900 font-bold">
                                Data de retirada:
                              </div>
                              <div className="text-gray-900">
                                {r.deadline || "-"}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm text-gray-900 font-bold">
                                Valor:
                              </div>
                              <div className="text-gray-900">
                                {formatCurrency(r.value)}
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Garantia:
                            </div>
                            <div className="text-gray-900">
                              {r.warranty || "-"}
                            </div>
                          </div>

                          {/* Mostra Valor apenas se FINALIZADO (já que foi mostrado acima se não finalizado) */}
                          {r.status === "FINALIZADO" && (
                            <div>
                              <div className="text-sm text-gray-900 font-bold">
                                Valor:
                              </div>
                              <div className="text-gray-900">
                                {formatCurrency(r.value)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Coluna 4: Observações (sozinha) */}
                        <div className="space-y-3 pl-4">
                          <div>
                            <div className="text-sm text-gray-900 font-bold">
                              Observações:
                            </div>
                            <div className="text-gray-900 whitespace-pre-wrap">
                              {r.notes || "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentRepair;
