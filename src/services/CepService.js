import { viaCepClient } from "../providers/via-cep";

class CepService {
  async getAddressByCep(cep) {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        return {
          success: false,
          error: 'CEP deve conter 8 dígitos'
        };
      }

      const response = await viaCepClient.get(`/${cleanCep}/json/`);
      
      if (response.data.erro) {
        return {
          success: false,
          error: 'CEP não encontrado'
        };
      }

      // Formata o endereço com as informações recebidas para que seja inserido no banco
      const addressString = [
        response.data.logradouro,
        response.data.bairro,
        response.data.localidade,
        response.data.uf
      ].filter(Boolean).join(', ');

      return {
        success: true,
        data: {
          cep: response.data.cep,
          logradouro: response.data.logradouro || '',
          complemento: response.data.complemento || '',
          bairro: response.data.bairro || '',
          localidade: response.data.localidade || '',
          uf: response.data.uf || '',
          addressString
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao buscar CEP. Verifique sua conexão.'
      };
    }
  }
}

export const cepService = new CepService();
