import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import RepairService from "../../services/RepairService";
import PageContainer from "../shared/PageContainer";
import Select from "../shared/Select";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import SideBar from "../shared/SideBar";
import RepairDetailSheet from "./RepairDetailSheet";
import CreateOrderModal from "./CreateOrderModal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../shared/pagination";

export function RepairPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [repairs, setRepairs] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (user && user.userType !== "ADMINISTRATOR") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const loadRepairs = useCallback(async () => {
    try {
      setLoading(true);
      // Backend is 0-based; UI is 1-based
      const response = await RepairService.getAllRepairs(currentPage - 1, pageSize);

      const repairsWithClients = (response.data ?? []).map((repair) => ({
        ...repair,
        clientName: repair.user?.name || "N/A",
        clientEmail: repair.user?.email || "",
        clientCpf: repair.user?.cpf || "",
        clientPhone: repair.user?.phone || "",
      }));

      setRepairs(repairsWithClients);
      setTotalElements(response.totalElements ?? 0);
      setTotalPages(response.totalPages ?? 0);
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
      toast.error("Erro ao carregar ordens de serviço");
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  const filterRepairs = useCallback(() => {
    let filtered = repairs;

    if (statusFilter !== "Todos") {
      filtered = filtered.filter((repair) => repair.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (repair) =>
          repair.id?.toString().includes(query) ||
          repair.serviceOrderId?.toLowerCase().includes(query) ||
          repair.clientName?.toLowerCase().includes(query),
      );
    }

    setFilteredRepairs(filtered);
  }, [repairs, statusFilter, searchQuery]);

  // Re-fetch whenever page changes
  useEffect(() => {
    loadRepairs();
  }, [loadRepairs]);

  useEffect(() => {
    filterRepairs();
  }, [filterRepairs]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      PENDING: "Pendente",
      IN_ANALYSIS: "Em Análise",
      COMPLETED: "Concluído",
      DELIVERED: "Entregue",
    };
    return statusMap[status] || status;
  };

  const handleRowClick = (repair) => {
    setSelectedRepair(repair);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = async () => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedRepair(null), 300);
    await loadRepairs();
  };

  const handleSaveOrder = async (orderData) => {
    try {
      await RepairService.createRepair(orderData);
      toast.success("Ordem de serviço criada com sucesso!");
      loadRepairs();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar ordem de serviço:", error);
      toast.error("Erro ao criar ordem de serviço");
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push("ellipsis-left");
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis-right");
    pages.push(totalPages);
    return pages;
  };

  if (!user || user.userType !== "ADMINISTRATOR") {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      <SideBar />

      <div className="flex-1">
        <PageContainer>
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-gray-100">Consertos</h1>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="!bg-[#ba5c00] hover:!bg-[#8a4500] hover:brightness-90 hover:shadow-lg transition-all duration-200 focus:ring-orange-100 text-sm px-4 py-2"
              >
                <Plus className="h-4 w-4" />
                Nova Ordem de Serviço
              </Button>
            </div>

            {/* Filters Section */}
            <div className="rounded-lg shadow-sm p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Pesquise o conserto pela OS ou nome do cliente"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  />
                </div>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="Todos">Status: Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="IN_ANALYSIS">Em Análise</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="DELIVERED">Entregue</option>
                </Select>
              </div>

              {(searchQuery || statusFilter !== "Todos") && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("Todos");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-320px)]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#041A2D] text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ordem de Serviço</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Eletrodoméstico(s)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Data de Recebimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {filteredRepairs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          Nenhuma ordem de serviço encontrada
                        </td>
                      </tr>
                    ) : (
                      filteredRepairs.map((repair, index) => (
                        <tr
                          key={repair.id}
                          className={`cursor-pointer transition-colors ${
                            index % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-blue-50 dark:bg-zinc-800"
                          }`}
                          onClick={() => handleRowClick(repair)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {getStatusLabel(repair.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                            #{repair.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {repair.clientName || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            <div className="space-y-1">
                              {repair.appliances && Array.isArray(repair.appliances) ? (
                                repair.appliances.map((appliance, idx) => {
                                  const applianceKey =
                                    typeof appliance === "string"
                                      ? `${repair.id}-appliance-${appliance}-${idx}`
                                      : `${repair.id}-appliance-${appliance.type || ""}-${appliance.brand || ""}-${appliance.model || ""}-${idx}`;
                                  return (
                                    <div key={applianceKey}>
                                      {idx + 1}.{" "}
                                      {typeof appliance === "string"
                                        ? appliance
                                        : `${appliance.type || ""} ${appliance.brand || ""} ${appliance.model || ""}`.trim() ||
                                          "Eletrodoméstico"}
                                    </div>
                                  );
                                })
                              ) : repair.appliances && typeof repair.appliances === "object" ? (
                                <div>
                                  1.{" "}
                                  {`${repair.appliances.type || ""} ${repair.appliances.brand || ""} ${repair.appliances.model || ""}`.trim() ||
                                    "Eletrodoméstico"}
                                </div>
                              ) : typeof repair.appliances === "string" ? (
                                repair.appliances
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(repair.receivedAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer: counter + pagination */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalElements === 0
                  ? "Nenhuma ordem de serviço encontrada"
                  : `Página ${currentPage} de ${totalPages} — ${totalElements} ordens no total`}
              </p>

              {totalPages > 1 && (
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage((p) => p - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page) =>
                      page === "ellipsis-left" || page === "ellipsis-right" ? (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      <RepairDetailSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        repair={selectedRepair}
        onUpdate={loadRepairs}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
}
