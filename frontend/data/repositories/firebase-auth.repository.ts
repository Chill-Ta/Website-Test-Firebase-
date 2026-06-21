import { AuthRepository } from "@/domain/repositories/auth.repository";
import { User } from "@/domain/entities/user.entity";
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export class FirebaseAuthRepository implements AuthRepository {
  private apiBase = "http://localhost:3000";

  constructor(private auth: Auth) {}

  private mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  async login(email: string, password: string): Promise<{ uid: string; idToken: string }> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await fetch(`${this.apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
    }

    return { uid: data.uid, idToken };
  }

  async register(email: string, password: string): Promise<{ message: string }> {
    const res = await fetch(`${this.apiBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
    }

    return { message: data.message || "สมัครสมาชิกสำเร็จ! กรุณาไปหน้า Login" };
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.mapFirebaseUser(this.auth.currentUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, (firebaseUser) => {
      callback(this.mapFirebaseUser(firebaseUser));
    });
  }

  async getIdToken(forceRefresh?: boolean): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No user authenticated in Firebase");
    return user.getIdToken(forceRefresh);
  }

  async fetchProfile(idToken: string): Promise<{ uid: string; message: string }> {
    const res = await fetch(`${this.apiBase}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถดึงข้อมูลได้");
    }

    return { uid: data.uid, message: data.message };
  }
}
