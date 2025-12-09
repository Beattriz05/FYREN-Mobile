import { Incident } from '@/utils/storage';

export type UserHomeStackParamList = {
  Home: undefined;
  History: undefined;
  IncidentDetail: { incident: Incident };
  RegisterIncident: { incident?: Incident };
};

export type ChiefTabParamList = {
  ChiefDashboard: undefined;
  IncidentList: undefined;
  Reports: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  UserManagement: undefined;
  Audit: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  Map: { incidentId?: string };
  IncidentDetail: { incident: Incident };
  UserManagement: undefined;
  Audit: undefined;
  Loading: undefined;
};