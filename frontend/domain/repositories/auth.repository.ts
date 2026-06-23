import { User } from "../entities/user.entity";

export interface AuthRepository {
  login(email: string, password: string): Promise<{ uid: string; idToken: string; role: string }>;
  register(email: string, password: string): Promise<{ message: string }>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  getIdToken(forceRefresh?: boolean): Promise<string>;
  fetchProfile(idToken: string): Promise<{ uid: string; message: string; role: string }>;
  fetchUsers(idToken: string): Promise<User[]>;
}

