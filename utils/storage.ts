import AsyncStorage from '@react-native-async-storage/async-storage';

const INCIDENTS_KEY = '@fyren_incidents';
const USERS_KEY = '@fyren_users';
const COMMENTS_KEY = '@fyren_comments';
const API_URL = 'https://fyren-backend-dntd.onrender.com'
// F-12: Interface para eventos da Linha do Tempo
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon?: string; // Para usar no ícone visual (ex: 'camera', 'check', 'edit')
}

export interface Incident {
  id?: string;
  title: string;
  description: string;
  type: string;
  vehicle: string;
  team: string;
  signature?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  syncStatus: 'synced' | 'pending_sync';
  location?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  videos?: string[]; // F-10: Suporte a vídeos
  timeline?: TimelineEvent[]; // F-12: Histórico de eventos
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  incidentId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'chief' | 'admin';
  createdAt: string;
  active: boolean;
}

// --- HELPERS ---
const createTimelineEvent = (
  title: string,
  desc?: string,
  icon: string = 'circle',
): TimelineEvent => ({
  id: Date.now().toString() + Math.random(),
  date: new Date().toISOString(),
  title,
  description: desc,
  icon,
});

// --- INCIDENTS ---

export async function saveIncident(incident: Incident): Promise<void> {
  const incidents = await getIncidents();

  // Cria o evento inicial da timeline
  const initialEvent = createTimelineEvent(
    'Ocorrência Criada',
    'Registro inicial no dispositivo.',
    'plus-circle',
  );

  const newIncident = {
    ...incident,
    id: Date.now().toString(),
    createdAt: incident.createdAt || new Date().toISOString(),
    syncStatus: 'pending_sync' as const,
    timeline: [initialEvent], // Inicia a timeline
    videos: incident.videos || [],
  };

  incidents.unshift(newIncident);
  await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  mockBackgroundSync(newIncident.id);
}

export async function getIncidents(): Promise<Incident[]> {
  try {
    const data = await AsyncStorage.getItem(INCIDENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting incidents:', error);
    return [];
  }
}

export async function updateIncident(
  id: string,
  updates: Partial<Incident>,
): Promise<void> {
  const incidents = await getIncidents();
  const index = incidents.findIndex((i) => i.id === id);

  if (index !== -1) {
    // Detecta mudanças para registrar na timeline
    const current = incidents[index];
    const newTimeline = [...(current.timeline || [])];

    if (updates.status && updates.status !== current.status) {
      newTimeline.unshift(
        createTimelineEvent(
          'Status Atualizado',
          `De ${current.status} para ${updates.status}`,
          'activity',
        ),
      );
    } else {
      newTimeline.unshift(
        createTimelineEvent(
          'Edição Realizada',
          'Dados da ocorrência foram alterados.',
          'edit-2',
        ),
      );
    }

    incidents[index] = {
      ...current,
      ...updates,
      syncStatus: 'pending_sync',
      updatedAt: new Date().toISOString(),
      timeline: newTimeline,
    };

    await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    mockBackgroundSync(id);
  }
}

// ... (Mantenha as funções saveComment, getComments, getUsers, saveUser, updateUser, clearAllData iguais ao anterior)
export async function saveComment(
  comment: Omit<Comment, 'id' | 'createdAt'>,
): Promise<void> {
  const comments = await getComments();
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export async function getComments(incidentId?: string): Promise<Comment[]> {
  try {
    const data = await AsyncStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = data ? JSON.parse(data) : [];
    return incidentId
      ? allComments.filter((c) => c.incidentId === incidentId)
      : allComments;
  } catch (error) {
    return [];
  }
}

export async function getUsers(): Promise<AppUser[]> {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    if (data) return JSON.parse(data);
    const defaultUsers: AppUser[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'user@email.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        active: true,
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'chief@email.com',
        role: 'chief',
        createdAt: new Date().toISOString(),
        active: true,
      },
      {
        id: '3',
        name: 'Admin Fyren',
        email: 'admin@email.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        active: true,
      },
    ];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (error) {
    return [];
  }
}

export async function saveUser(
  user: Omit<AppUser, 'id' | 'createdAt'>,
): Promise<void> {
  const users = await getUsers();
  const newUser = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function updateUser(
  id: string,
  updates: Partial<AppUser>,
): Promise<void> {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([INCIDENTS_KEY, COMMENTS_KEY]);
}

async function mockBackgroundSync(id: string) {
  setTimeout(async () => {
    try {
      const incidents = await getIncidents();
      const index = incidents.findIndex((i) => i.id === id);
      if (index !== -1 && incidents[index].syncStatus === 'pending_sync') {
        const current = incidents[index];
        // Adiciona evento de sincronização na timeline
        const syncEvent = createTimelineEvent(
          'Sincronizado',
          'Dados enviados ao servidor central.',
          'cloud',
        );
        current.timeline = [syncEvent, ...(current.timeline || [])];
        current.syncStatus = 'synced';

        incidents[index] = current;
        await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
      }
    } catch (e) {}
  }, 5000);
}
