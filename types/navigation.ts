import { Incident } from '@/utils/storage';

// Rotas para o Tab Bar do Usuário Comum
export type UserHomeStackParamList = {
  Home: undefined;
  History: undefined;
  IncidentDetail: { incident: Incident };
  RegisterIncident: { incident?: Incident };
  Profile: undefined; // <--- Adicionado para corrigir o erro no Tab
};

// Rotas para o Tab Bar do Chefe
export type ChiefTabParamList = {
  ChiefDashboard: undefined;
  IncidentList: undefined;
  Reports: undefined;
  Profile: undefined;
};

// Rotas para o Tab Bar do Admin
export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  Audit: undefined;
  Profile: undefined;
};

// Rotas para o Stack Principal (Telas cheias)
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined; // Contém os Tab Navigators
  Map: { incidentId?: string };
  IncidentDetail: { incident: Incident };
  UserManagement: undefined; // <--- Adicionado para corrigir erro no Stack
  Audit: undefined;          // <--- Adicionado para corrigir erro no Stack
  Loading: undefined;
};