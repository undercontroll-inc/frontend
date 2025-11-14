import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../shared/Input';
import Button from '../shared/Button';

export const ClientModal = ({ isOpen, onClose, onSave, client = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    cpf: '',
    CEP: '',
    address: '',
    addressNumber: '',
    password: '',
    avatarUrl: '',
    userType: 'CUSTOMER'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        lastName: client.lastName || '',
        phone: client.phone || '',
        email: client.email || '',
        cpf: client.cpf || '',
        CEP: client.CEP || '',
        address: client.address || '',
        addressNumber: client.addressNumber || '',
        password: '',
        avatarUrl: client.avatarUrl || '',
        userType: client.userType || 'CUSTOMER'
      });
    } else {
      resetForm();
    }
  }, [client, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      lastName: '',
      phone: '',
      email: '',
      cpf: '',
      CEP: '',
      address: '',
      addressNumber: '',
      password: '',
      avatarUrl: '',
      userType: 'CUSTOMER'
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.CEP.trim()) {
      newErrors.CEP = 'CEP é obrigatório';
    }

    if (!formData.addressNumber.trim()) {
      newErrors.addressNumber = 'Número é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Preparar dados para envio com todos os campos necessários
    const dataToSend = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password || "",
      address: formData.address,
      cpf: formData.cpf,
      avatarUrl: formData.avatarUrl || "",
      userType: formData.userType,
      CEP: formData.CEP
    };

    onSave(dataToSend);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {client ? 'Editar Cliente' : 'Cadastrar novo cliente'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome*
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Insira o nome"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                </div>

                {/* Sobrenome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome*
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Insira o sobrenome"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Celular/Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular/Telefone*
                  </label>
                  <Input
                    type="text"
                    name="phone"
                    placeholder="Insira o celular ou telefone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Insira o e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <Input
                    type="text"
                    name="cpf"
                    placeholder="Insira o CPF"
                    value={formData.cpf}
                    onChange={handleChange}
                    error={errors.cpf}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <Input
                    type="text"
                    name="CEP"
                    placeholder="Insira o CEP"
                    value={formData.CEP}
                    onChange={handleChange}
                    error={errors.CEP}
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Insira o endereço"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                  />
                </div>
              </div>

              {/* Número */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número *
                </label>
                <Input
                  type="text"
                  name="addressNumber"
                  placeholder="Insira o número da residência"
                  value={formData.addressNumber}
                  onChange={handleChange}
                  error={errors.addressNumber}
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
            >
              {client ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ClientModal;
