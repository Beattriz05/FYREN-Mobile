import AsyncStorage from '@react-native-async-storage/async-storage';

const INCIDENTS_KEY = '@fyren_incidents';
const USERS_KEY = '@fyren_users';
const COMMENTS_KEY = '@fyren_comments';

export interface Incident {
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  location?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  assignedTo?: string;
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

export async function saveIncident(incident: Incident): Promise<void> {
  const incidents = await getIncidents();
  const newIncident = {
    ...incident,
    id: Date.now().toString(),
    createdAt: incident.createdAt || new Date().toISOString(),
  };
  incidents.unshift(newIncident);
  await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
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

export async function updateIncident(id: string, updates: Partial<Incident>): Promise<void> {
  const incidents = await getIncidents();
  const index = incidents.findIndex(i => i.id === id);
  if (index !== -1) {
    incidents[index] = {
      ...incidents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  }
}

export async function saveComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<void> {
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
      ? allComments.filter(c => c.incidentId === incidentId)
      : allComments;
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function getUsers(): Promise<AppUser[]> {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    
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
    console.error('Error getting users:', error);
    return [];
  }
}

export async function saveUser(user: Omit<AppUser, 'id' | 'createdAt'>): Promise<void> {
  const users = await getUsers();
  const newUser: AppUser = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function updateUser(id: string, updates: Partial<AppUser>): Promise<void> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([INCIDENTS_KEY, COMMENTS_KEY]);
}
