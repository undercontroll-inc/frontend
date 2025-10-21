import { useState, useEffect } from "react";
import { Search, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SideBar from "../shared/SideBar";
import RepairService from "../../services/RepairService";
import Loading from "../shared/Loading";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Select from "../shared/Select";
import Alert from "../shared/Alert";
import RepairCard from "./RepairCard";

const ComponentRepair = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    document.title = "Dashboard - Reparos";
  }, []);

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

      <div className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Consertos</h1>
            <div className="flex items-center gap-3">
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

          <div className="mb-6">
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <p className="text-sm leading-relaxed text-center text-gray-700">
                Nesta página você encontra todas as ordens de serviço realizadas
                em nossa assistência técnica. Aqui é possível acompanhar seus
                pedidos e verificar o status de cada atendimento.
              </p>
              <p className="text-sm mt-2 text-center text-gray-700">
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
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
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
            <div className="flex flex-col gap-4">
              {filtered.map((repair) => (
                <RepairCard key={repair.id} repair={repair} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentRepair;
