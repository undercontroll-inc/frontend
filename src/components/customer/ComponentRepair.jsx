import { useState, useEffect, useMemo, useCallback } from "react";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Validacao do primeiro login
    if (user.inFirstLogin) {
      navigate("/nova-senha");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Reparos";
  }, []);

  const loadRepairs = useCallback(async () => {
    try {
      setLoading(true);
      let data = [];

      if (user?.id) {
        try {
          data = { data } = await RepairService.getUserRepairs(user.id);
        } catch (err) {
          console.error("Erro ao buscar reparos do usuário:", err);
        }
      } else {
        data = null;
      }

      if (!Array.isArray(data)) data = [];
      setRepairs(data.reverse());
    } catch (err) {
      console.error("Erro ao carregar consertos:", err);
      setAlert({
        type: "error",
        message: "Erro ao carregar consertos. Tente novamente.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRepairs();
  }, [loadRepairs]);

  const filtered = useMemo(() => {
    return repairs.filter((r) => {
      const term = searchTerm.trim().toLowerCase();
      if (statusFilter && r.status !== statusFilter) return false;
      if (!term) return true;

      // Busca nos eletrodomésticos
      const applianceMatch = r.appliances?.some(
        (a) =>
          (a.type || "").toLowerCase().includes(term) ||
          (a.brand || "").toLowerCase().includes(term) ||
          (a.model || "").toLowerCase().includes(term) ||
          (a.serial || "").toLowerCase().includes(term),
      );

      // Busca na descrição do serviço
      const serviceMatch = (r.serviceDescription || "")
        .toLowerCase()
        .includes(term);

      return applianceMatch || serviceMatch;
    });
  }, [repairs, searchTerm, statusFilter]);

  if (loading) {
    return <Loading text="Carregando consertos..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <SideBar active="repairs" />

      <div className="flex-1 flex flex-col overflow-hidden ml-[280px]">
        <div className="py-8 px-20 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Consertos</h1>

            {/* Filters Section */}
            <div className="rounded-lg shadow-sm p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar por: Tipo do aparelho, marca ou modelo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="PENDING">Pendente</option>
                  <option value="IN_ANALYSIS">Em Análise</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="DELIVERED">Entregue</option>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter) && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="border border-gray-300 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-900 space-y-4">
              <p className="text-sm leading-relaxed text-center text-gray-700 dark:text-gray-300">
                Nesta página você encontra todas as ordens de serviço realizadas
                em nossa assistência técnica. Aqui é possível acompanhar seus
                pedidos e verificar o status de cada atendimento.
              </p>

              <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                <p className="text-sm leading-relaxed text-center text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-[#BA4A00]">OBSERVAÇÃO:</span>{" "}
                  O prazo para retirada dos produtos é de{" "}
                  <span className="font-bold">30 dias</span>. Após esta data
                  será cobrado
                  <span className="font-bold"> R$ 1,00 por dia</span> de
                  permanência. <br /> Produto não retirado no prazo máximo de{" "}
                  <span className="font-bold">60 dias</span> será desmontado
                  para recuperação das peças aplicadas.
                </p>
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
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-12 text-center shadow-sm">
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
