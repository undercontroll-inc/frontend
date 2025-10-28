import { useState, useEffect } from "react";
import SideBar from "../shared/SideBar";
import Button from "../shared/Button";
import Input from "../shared/Input";
import Select from "../shared/Select";
import ItemModal from "./ItemModal";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { StorageService } from "../../services/StorageService";
import { useToast } from "../../contexts/ToastContext";
import Loading from "../shared/Loading";

export function Estoque() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const toast = useToast();

    // Buscar itens do JSON server
    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await StorageService.getAll();
            setItems(data);
        } catch (error) {
            toast.error("Erro ao carregar itens do estoque");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveItem = async (itemData, itemId) => {
        try {
            if (itemId) {
                // Editar item existente
                await StorageService.update(itemId, itemData);
                toast.success("Item atualizado com sucesso!");
            } else {
                // Criar novo item
                await StorageService.create(itemData);
                toast.success("Item cadastrado com sucesso!");
            }
            await loadItems();
            setIsModalOpen(false);
            setSelectedItem(null);
        } catch (error) {
            toast.error("Erro ao salvar item");
            console.error("Erro ao salvar item:", error);
        }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este item?")) {
            try {
                await StorageService.delete(id);
                toast.success("Item excluído com sucesso!");
                await loadItems();
            } catch (error) {
                toast.error("Erro ao excluir item");
            }
        }
    };

    const handleOpenModal = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesBrand = !brandFilter || item.brand === brandFilter;
        const matchesSupplier = !supplierFilter || item.supplier === supplierFilter;
        
        return matchesSearch && matchesCategory && matchesBrand && matchesSupplier;
    });

    const clearFilters = () => {
        setSearchTerm("");
        setCategoryFilter("");
        setBrandFilter("");
        setSupplierFilter("");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <SideBar active="storage" />
                <div className="flex-1 flex items-center justify-center">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideBar active="storage" />
            
            <div className="flex-1 p-4 lg:p-6 overflow-x-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Gerenciamento de Estoque</h1>
                    <Button 
                        onClick={handleOpenModal}
                        className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 text-sm px-4 py-2"
                    >
                        <Plus className="h-4 w-4" />
                        Cadastrar novo item
                    </Button>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Pesquisa por item"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">Todas as categorias</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Elétrica">Elétrica</option>
                            <option value="Ferramentas">Ferramentas</option>
                            <option value="Informática">Informática</option>
                            <option value="Peças de Reposição">Peças de Reposição</option>
                        </Select>

                        {/* Brand Filter */}
                        <Select
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                        >
                            <option value="">Todas as marcas</option>
                            <option value="Prico">Prico</option>
                            <option value="Multimoda">Multimoda</option>
                            <option value="Turbo">Turbo</option>
                            <option value="Tramontino">Tramontino</option>
                            <option value="Elgin">Elgin</option>
                            <option value="Arno">Arno</option>
                        </Select>

                        {/* Supplier Filter */}
                        <Select
                            value={supplierFilter}
                            onChange={(e) => setSupplierFilter(e.target.value)}
                        >
                            <option value="">Todos os fornecedores</option>
                            <option value="TecnoMicro">TecnoMicro</option>
                            <option value="EletroMaster">EletroMaster</option>
                            <option value="Casa do Eletro">Casa do Eletro</option>
                            <option value="Ferragens Silva">Ferragens Silva</option>
                            <option value="ManuCorner">ManuCorner</option>
                            <option value="DistroNitro">DistroNitro</option>
                        </Select>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || categoryFilter || brandFilter || supplierFilter) && (
                        <div className="mt-4">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Scrollable container for table */}
                    <div className="overflow-auto max-h-[calc(100vh-280px)]">
                        <table className="w-full min-w-max">
                            <thead className="bg-[#041A2D] text-white sticky top-0 z-10">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">ID</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Item</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Marca</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Categoria</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Qtd.</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Preço</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Fornecedor</th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold whitespace-nowrap">Descrição</th>
                                    <th className="px-3 py-3 text-center text-xs font-semibold whitespace-nowrap">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-8">
                                            <p className="text-gray-500 text-sm">Nenhum item encontrado com os filtros aplicados.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, index) => (
                                        <tr 
                                            key={item.id} 
                                            className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                                        >
                                            <td className="px-3 py-3 text-xs text-gray-900">{item.id}</td>
                                            <td className="px-3 py-3 text-xs text-gray-900 max-w-[150px] truncate" title={item.item}>{item.item}</td>
                                            <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">{item.brand}</td>
                                            <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">{item.category}</td>
                                            <td className="px-3 py-3 text-xs text-gray-900">{item.quantity}</td>
                                            <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">{item.price}</td>
                                            <td className="px-3 py-3 text-xs text-gray-900 whitespace-nowrap">{item.supplier}</td>
                                            <td className="px-3 py-3 text-xs text-gray-600 max-w-[200px] truncate" title={item.description}>
                                                {item.description}
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-center gap-1">
                                                    <button 
                                                        onClick={() => handleEditItem(item)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Counter */}
                <div className="mt-4 text-sm text-gray-600">
                    Mostrando {filteredItems.length} de {items.length} itens
                </div>
            </div>

            {/* Modal */}
            <ItemModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                item={selectedItem}
                onSave={handleSaveItem}
            />
        </div>
    );
}