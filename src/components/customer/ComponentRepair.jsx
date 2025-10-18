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
import SideBar from "../shared/SideBar";
import RepairService from "../../services/RepairService";
import Loading from "../shared/Loading";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Select from "../shared/Select";
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
          data = await RepairService.getAllRepairs(user.id);
        } catch (err) {
          // Fallback: busca todos se falhar buscar por userId
          data = await RepairService.getAllRepairs();
        }
      } else {
        data = await RepairService.getAllRepairs();
      }

      if (!Array.isArray(data)) data = [];
      setRepairs(data.reverse());
    } catch (error) {
      console.error("Erro ao carregar consertos:", error);
      setAlert({
        type: "error",
        message: "Erro ao carregar consertos. Verifique se o json-server está rodando.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filtered = repairs.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    if (statusFilter && r.status !== statusFilter) return false;
    if (!term) return true;

    // Busca nos eletrodomésticos
    const applianceMatch = r.appliances?.some(
      (a) =>
        (a.type || "").toLowerCase().includes(term) ||
        (a.brand || "").toLowerCase().includes(term) ||
        (a.model || "").toLowerCase().includes(term) ||
        (a.serial || "").toLowerCase().includes(term)
    );

    // Busca na descrição do serviço
    const serviceMatch = (r.serviceDescription || "")
      .toLowerCase()
      .includes(term);

    return applianceMatch || serviceMatch;
  });

  if (loading) return <Loading text="Carregando consertos..." />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="repairs" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen p-8 ">
        <div className="max-w-6xl mx-auto py-2 pl-10">
          <div className="flex items-center justify-between pb-10">
            <h1 className="text-3xl font-bold text-gray-900">Consertos</h1>
            <div className="flex items-center gap-3 w-full max-w-2xl">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                containerClassName="w-48"
              >
                <option value="">Status: Todos</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="NAO_INICIADO">Não Iniciado</option>
              </Select>
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

          {/* Aviso/descrição da página */}
          <div className="pb-6">
            <div className="bg-gray-300 border border-gray-900 rounded-lg p-4 text-gray-900">
              <p className="text-sm leading-relaxed text-center">
                Nesta página você encontra todas as ordens de serviço realizadas
                em nossa assistência técnica. Aqui é possível acompanhar seus
                pedidos e verificar o status de cada atendimento.
              </p>
              <p className="text-sm mt-2 text-center">
                <span className="font-bold">Observação:</span> O prazo para
                retirada dos produtos é de 30 dias. Após esta data será
                cobrado R$ 1,00 por dia de permanência. Produto não retirado no
                prazo máximo de 60 dias será desmontado para recuperação das
                peças aplicadas.
              </p>
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
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm ">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum conserto encontrado
              </h3>
              <p className="text-gray-600 mb-6 pb-5">
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
                    className="bg-white border border-black-500 rounded-xl shadow-md overflow-hidden"
                  >
                    {/* Cabeçalho do card */}
                    <div className="flex items-center justify-between p-4 bg-[#041A2D] text-white">
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5" />
                        <div className="text-sm font-medium">
                          Ordem de Serviço:
                        </div>
                        <div className="font-semibold">#{`A${r.id}`}</div>
                        <div className="flex items-center gap-2 pl-40">
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
                      </div>
                    </div>

                    {/* Visualização compacta */}
                    <div className="p-3 bg-gray-300 pl-8">
                      <div
                        className={`grid ${
                          r.status === "FINALIZADO"
                            ? "grid-cols-4 pr-20 "
                            : "grid-cols-3"
                        } gap-4 text-sm mb-4`}
                      >
                        <div>
                          <div className="text-sm text-gray-900 font-bold mb-1">
                            Eletrodomésticos:
                          </div>
                          <div className="text-gray-900 whitespace-pre-line">
                            {r.appliances?.length > 0
                              ? r.appliances
                                  .map(
                                    (a, idx) => `${idx + 1}- ${a.type || "-"}`
                                  )
                                  .join("\n")
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 font-bold mb-1">
                            Valor Total:
                          </div>
                          <div className="text-gray-900">
                            {formatCurrency(r.totalValue)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 font-bold mb-1">
                            Data de Recebimento:
                          </div>
                          <div className="text-gray-900">
                            {r.receivedAt || "-"}
                          </div>
                        </div>
                        {/* Condicional: Se FINALIZADO mostra Data de retirada */}
                        {r.status === "FINALIZADO" && (
                          <div>
                            <div className="text-sm text-gray-900 font-bold mb-1">
                              Data de retirada:
                            </div>
                            <div className="text-gray-900">
                              {r.deadline || "-"}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end text-sm">
                        <button
                          type="button"
                          onClick={() => navigate(`/repairs/${r.id}`)}
                         className="inline-flex items-center justify-center rounded-md px-4 py-2 h-8 font-medium bg-blue-900 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 cursor-pointer"
                        >
                          Ver Detalhes da OS
                        </button>
                      </div>
                    </div>
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
