import { useState, useEffect } from "react";
import { Search, Plus, Wrench, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ComponentService from "../../services/ComponentService";
import ComponentCard from "./ComponentCard";
import ComponentModal from "./ComponentModal";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Loading from "../shared/Loading";
import Alert from "../shared/Alert";
import PageContainer from "../shared/PageContainer";
import Card from "../shared/Card";

const Dashboard = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [alert, setAlert] = useState(null);

  const { user, logout } = useAuth();
  console.log("Authenticated user:", user);

  useEffect(() => {
    loadComponents();
  }, []);

  useEffect(() => {
    filterComponents();
  }, [components, searchTerm, selectedCategory]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      const data = await ComponentService.getAllComponents();
      setComponents(data);

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((c) => c.category))].sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading components:", error);
      showAlert(
        "error",
        "Erro ao carregar componentes. Verifique se o json-server está rodando."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterComponents = () => {
    let filtered = components;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (component) =>
          component.name.toLowerCase().includes(searchLower) ||
          component.description.toLowerCase().includes(searchLower) ||
          component.brand.toLowerCase().includes(searchLower) ||
          component.supplier.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (component) => component.category === selectedCategory
      );
    }

    setFilteredComponents(filtered);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateComponent = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  const handleEditComponent = (component) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const handleSaveComponent = async (componentData, componentId) => {
    try {
      if (componentId) {
        // Update existing component
        await ComponentService.updateComponent(componentId, componentData);
        showAlert("success", "Componente atualizado com sucesso!");
      } else {
        // Create new component
        await ComponentService.createComponent(componentData);
        showAlert("success", "Componente criado com sucesso!");
      }

      await loadComponents();
    } catch (error) {
      console.error("Error saving component:", error);
      showAlert("error", "Erro ao salvar componente. Tente novamente.");
      throw error; // Re-throw to handle in modal
    }
  };

  const handleDeleteComponent = async (componentId) => {
    try {
      await ComponentService.deleteComponent(componentId);
      showAlert("success", "Componente excluído com sucesso!");
      await loadComponents();
    } catch (error) {
      console.error("Error deleting component:", error);
      showAlert("error", "Erro ao excluir componente. Tente novamente.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <Loading text="Carregando componentes..." />;
  }

  return (
    <PageContainer>
      {/* Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold mb-2 flex items-center gap-3">
              <Wrench className="h-8 w-8" />
              Dashboard de Componentes
            </h1>
            <p className="text-gray-600">
              Sistema de Gerenciamento de Componentes Microeletrônicos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Bem-vindo, <span className="font-medium">{user?.name}</span>
            </span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar componentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleCreateComponent} variant="primary">
            <Plus className="h-4 w-4" />
            Novo Componente
          </Button>
        </div>
      </Card>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Components Grid */}
      {filteredComponents.length === 0 ? (
        <Card>
          <div className="text-center">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {components.length === 0
                ? "Nenhum componente cadastrado"
                : "Nenhum componente encontrado"}
            </h3>
            <p className="text-gray-600 mb-6">
              {components.length === 0
                ? "Comece criando seu primeiro componente eletrônico"
                : "Tente ajustar os filtros de pesquisa"}
            </p>
            {components.length === 0 && (
              <Button onClick={handleCreateComponent} variant="primary">
                <Plus className="h-4 w-4" />
                Criar Primeiro Componente
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              onEdit={handleEditComponent}
              onDelete={handleDeleteComponent}
            />
          ))}
        </div>
      )}

      {/* Component Modal */}
      <ComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        component={editingComponent}
        onSave={handleSaveComponent}
      />
    </PageContainer>
  );
};

export default Dashboard;
