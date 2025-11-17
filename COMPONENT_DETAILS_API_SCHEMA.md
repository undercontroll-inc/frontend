# Esquema de Dados - ComponentDetails (Detalhes da Ordem de Serviço para Cliente)

## Endpoint
`GET /repairs/:id` ou `GET /api/orders/:id`

## Estrutura de Dados Esperada

```typescript
{
  id: number,                    // ID da ordem de serviço
  status: string,                // Status: "PENDING" | "IN_ANALYSIS" | "COMPLETED" | "DELIVERED"
  updatedAt: string,             // Data/hora da última atualização (formato: ISO 8601 ou "DD/MM/YYYY HH:mm:ss")
  
  // Eletrodomésticos
  appliances: Array<{
    type: string,                // Tipo do eletrodoméstico (ex: "Geladeira", "Fogão")
    brand: string,               // Marca (ex: "Brastemp", "Electrolux")
    model: string,               // Modelo do aparelho
    voltage: string,             // Voltagem (ex: "110V", "220V", "Bivolt")
    serial: string,              // Número de série
    customerNote: string         // Observação do cliente sobre o problema (OPCIONAL)
  }>,
  
  // Peças utilizadas
  parts: Array<{
    item: string,                // Nome da peça (alternativa: "name")
    name: string,                // Nome da peça (alternativa: "item")
    quantity: number,            // Quantidade utilizada
    price: number                // Preço unitário da peça
  }>,
  
  // Valores financeiros
  laborValue: number,            // Valor total da mão de obra
  partsTotal: number,            // Valor total das peças
  discount: number,              // Desconto aplicado (OPCIONAL, padrão: 0)
  totalValue: number,            // Valor total da ordem (peças + mão de obra - desconto)
  
  // Datas e prazos
  receivedAt: string,            // Data de recebimento (formato: "DD/MM/YYYY")
  deadline: string,              // Data de retirada/prazo (formato: "DD/MM/YYYY") (OPCIONAL)
  warranty: string,              // Período de garantia (ex: "90 dias", "6 meses") (OPCIONAL)
  
  // Observações
  notes: string,                 // Observações gerais do cliente (OPCIONAL - usado se não houver customerNote por item)
  serviceDescription: string     // Observações técnicas do serviço (OPCIONAL)
}
```

## Exemplo Real de JSON

```json
{
  "id": 123,
  "status": "COMPLETED",
  "updatedAt": "2025-11-17T14:30:00.000Z",
  
  "appliances": [
    {
      "type": "Geladeira",
      "brand": "Brastemp",
      "model": "BRM50",
      "voltage": "220V",
      "serial": "ABC123456",
      "customerNote": "Não está gelando adequadamente e fazendo barulho estranho"
    },
    {
      "type": "Fogão",
      "brand": "Electrolux",
      "model": "56DTX",
      "voltage": "Bivolt",
      "serial": "XYZ789012",
      "customerNote": "Queimador esquerdo não acende"
    }
  ],
  
  "parts": [
    {
      "item": "Compressor",
      "quantity": 1,
      "price": 450.00
    },
    {
      "item": "Gás R600a",
      "quantity": 2,
      "price": 35.00
    },
    {
      "item": "Ignitor",
      "quantity": 1,
      "price": 25.00
    }
  ],
  
  "laborValue": 230.00,
  "partsTotal": 545.00,
  "discount": 50.00,
  "totalValue": 725.00,
  
  "receivedAt": "10/11/2025",
  "deadline": "20/11/2025",
  "warranty": "90 dias",
  
  "notes": "Cliente solicitou urgência no reparo da geladeira",
  "serviceDescription": "Compressor substituído com sucesso. Sistema de gás recarregado. Teste de resfriamento aprovado após 4 horas. Ignitor do fogão substituído e testado."
}
```

## Campos Obrigatórios vs Opcionais

### ✅ Obrigatórios
- `id` - Identificador da ordem
- `status` - Estado atual da ordem
- `appliances` - Array com pelo menos 1 eletrodoméstico
  - `appliances[].type` - Tipo do aparelho
- `totalValue` - Valor total da ordem

### ⚠️ Opcionais (podem ser `null`, `undefined`, `""` ou `0`)
- `updatedAt` - Exibido como "-" se ausente
- `appliances[].brand` - Exibido como "-" se ausente
- `appliances[].model` - Exibido como "-" se ausente
- `appliances[].voltage` - Exibido como "-" se ausente
- `appliances[].serial` - Exibido como "-" se ausente
- `appliances[].customerNote` - Exibido como "-" se ausente
- `parts` - Array pode estar vazio
- `laborValue` - Pode ser 0 ou ausente
- `partsTotal` - Calculado se parts existir
- `discount` - Padrão 0
- `receivedAt` - Exibido como "-" se ausente
- `deadline` - Exibido como "-" se ausente (só mostra se status for COMPLETED ou DELIVERED)
- `warranty` - Exibido como "-" se ausente
- `notes` - Não exibido se ausente
- `serviceDescription` - Não exibido se ausente

## Mapeamento de Status

| Valor do Backend | Cor/Estilo | Label PT-BR |
|------------------|------------|-------------|
| `PENDING` | Amarelo | Pendente |
| `IN_ANALYSIS` | Azul | Em Análise |
| `COMPLETED` | Verde | Concluído |
| `DELIVERED` | Verde escuro | Entregue |

## Regras de Negócio na Tela

1. **Data de Retirada**: Só é exibida se o status for `COMPLETED` ou `DELIVERED`

2. **Observações do Cliente**:
   - Se houver `customerNote` em qualquer `appliance`, exibe um card para cada item
   - Caso contrário, exibe o campo global `notes` se existir

3. **Observações Técnicas**: Só exibe se `serviceDescription` estiver preenchido

4. **Cálculo de Totais**:
   - Total de Peças: Soma de `(quantity * price)` de cada item em `parts`
   - Total Quantidade: Soma de `quantity` de todas as peças
   - Valor Total: `laborValue + partsTotal - discount`

5. **Formatação**:
   - Valores monetários: `R$ 0,00` (formato BR)
   - Datas: `DD/MM/YYYY` ou `DD/MM/YYYY HH:mm:ss`
   - Ausência de dados: Exibir `"-"`

## Tipos TypeScript

```typescript
interface Appliance {
  type: string;
  brand?: string;
  model?: string;
  voltage?: string;
  serial?: string;
  customerNote?: string;
}

interface Part {
  item?: string;
  name?: string;
  quantity: number;
  price: number;
}

interface RepairDetails {
  id: number;
  status: 'PENDING' | 'IN_ANALYSIS' | 'COMPLETED' | 'DELIVERED';
  updatedAt?: string;
  
  appliances: Appliance[];
  parts?: Part[];
  
  laborValue?: number;
  partsTotal?: number;
  discount?: number;
  totalValue: number;
  
  receivedAt?: string;
  deadline?: string;
  warranty?: string;
  
  notes?: string;
  serviceDescription?: string;
}
```

## Compatibilidade com Backend Atual

A tela também suporta os seguintes campos alternativos (legado):
- `part.name` como alternativa a `part.item`
- Status antigos: `EM_ANDAMENTO`, `FINALIZADO`, `NAO_INICIADO` (convertidos automaticamente)

## Arquivo de Implementação
`/src/components/customer/ComponentDetails.jsx`
