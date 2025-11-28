# Dashboard de Analytics

## 📊 Visão Geral

Dashboard completo de análise de dados com métricas, gráficos e indicadores de desempenho para o sistema de gestão de reparos.

## 🎯 Funcionalidades

### Cards de Métricas (KPIs)
- **Faturamento Total**: Valor total de faturamento no período
- **Margem de Lucro**: Percentual e valor de lucro
- **Ticket Médio**: Valor médio por ordem de serviço
- **Ordens em Andamento**: Quantidade de serviços ativos
- **Ordens Finalizadas**: Quantidade de serviços concluídos
- **Tempo Médio de Reparo**: Tempo médio para conclusão

### Gráficos Disponíveis

#### 1. Evolução: Faturamento x Lucro x Ordens de Serviço
- Gráfico de área com 3 linhas
- Mostra tendências ao longo dos meses
- Permite visualizar correlação entre métricas

#### 2. Clientes Recorrentes x Novos
- Gráfico de linhas comparativo
- Identifica crescimento da base de clientes
- Análise de retenção

#### 3. Ordens de Serviço por Status
- Gráfico de barras horizontais
- Visualização clara da distribuição por status
- Cores diferenciadas por categoria

#### 4. Eletrodomésticos Mais Consertados
- Gráfico de barras verticais
- Top 5 equipamentos mais frequentes

#### 5. Top 10 Peças/Acessórios Mais Utilizadas
- Gráfico de barras
- Identifica peças de maior demanda
- Útil para gestão de estoque

## 🔧 Filtros Disponíveis

### Período
- Últimos 7 dias
- Últimos 30 dias
- Últimos 90 dias
- Este ano

### Status
- Todos
- Em andamento
- Finalizadas
- Canceladas

## 🚀 Como Acessar

1. Faça login como **ADMINISTRATOR**
2. No menu lateral, clique em **Dashboard**
3. Ou acesse diretamente: `/analytics`

## 💡 Customização

### Alterar Dados
Os dados estão mockados no componente. Para integrar com API real:

```javascript
// No useEffect, substitua os dados mockados por chamadas à API
useEffect(() => {
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar métricas
      const metricsData = await DashboardService.getMetrics(period, status);
      setMetrics(metricsData);
      
      // Buscar dados de evolução
      const evolutionData = await DashboardService.getEvolution(period);
      // ... atualizar estados
      
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  
  loadDashboardData();
}, [period, status]);
```

### Adicionar Novos Gráficos

Exemplo de novo gráfico:

```jsx
<Card className="p-6">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
    Meu Novo Gráfico
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={meusDados}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="label" stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip />
      <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</Card>
```

## 📦 Dependências

```bash
npm install recharts
```

## 🎨 Cores Utilizadas

- **Azul** (#3b82f6): Faturamento, informações gerais
- **Roxo** (#8b5cf6): Lucro, dados secundários
- **Verde** (#10b981): Ordens finalizadas, sucesso
- **Vermelho** (#ef4444): Canceladas, alertas
- **Laranja** (#f59e0b): Em andamento, avisos
- **Ciano** (#06b6d4): Eletrodomésticos
- **Índigo** (#6366f1): Peças/acessórios

## 📱 Responsividade

O dashboard é totalmente responsivo:
- **Desktop**: Grid com 3 colunas de métricas
- **Tablet**: Grid com 2 colunas
- **Mobile**: Grid com 1 coluna

## 🔐 Permissões

- **Acesso**: Apenas usuários com role `ADMINISTRATOR`
- **Rota protegida**: `/analytics`

## 📈 Exemplos de Uso

### Análise de Desempenho
Use o dashboard para:
- Identificar períodos de maior faturamento
- Monitorar margem de lucro
- Avaliar eficiência operacional (tempo médio de reparo)

### Gestão de Estoque
Use os gráficos de peças para:
- Identificar itens de alta demanda
- Planejar compras
- Evitar rupturas de estoque

### Análise de Clientes
Use os dados de clientes para:
- Medir taxa de retenção
- Identificar sazonalidade
- Planejar campanhas de marketing

## 🐛 Troubleshooting

### Gráficos não aparecem
- Verifique se o Recharts está instalado: `npm list recharts`
- Limpe o cache: `npm run dev -- --force`

### Dados não carregam
- Verifique a conexão com a API
- Confira logs no console do navegador
- Valide permissões de usuário

## 🔮 Melhorias Futuras

- [ ] Exportar relatórios em PDF
- [ ] Comparação entre períodos
- [ ] Gráficos interativos com drill-down
- [ ] Alertas e notificações personalizadas
- [ ] Dashboard em tempo real (WebSocket)
- [ ] Customização de layout (drag & drop)
