
export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'Ativo' | 'Pausado' | 'Em Configuração';
  conversionRate: number;
  avatar?: string;
  category: string;
  persona: string;
  temperature: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Qualificado' | 'Em Análise' | 'Desqualificado';
  energyBill: string;
  propertyType: string;
  lastActivity: string;
  agentId: string;
}

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  prompt: string;
  variable?: string;
  dataType?: string;
  icon: string;
}

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}
