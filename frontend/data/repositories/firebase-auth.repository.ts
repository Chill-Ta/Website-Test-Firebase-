import { AuthRepository } from "@/domain/repositories/auth.repository";
import { User } from "@/domain/entities/user.entity";
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";

export class FirebaseAuthRepository implements AuthRepository {
  private apiBase = "http://localhost:8080";

  constructor(private auth: Auth) {}

  private mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  async login(email: string, password: string): Promise<{ uid: string; idToken: string; role: string }> {
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

    return { uid: data.uid, idToken, role: data.role };
  }

  async register(email: string, password: string, role: string): Promise<{ message: string }> {
    const res = await fetch(`${this.apiBase}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
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

  async fetchProfile(idToken: string): Promise<{ uid: string; message: string; role: string }> {
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

    return { uid: data.uid, message: data.message, role: data.role };
  }

  async fetchUsers(idToken: string): Promise<User[]> {
    const res = await fetch(`${this.apiBase}/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถดึงข้อมูลรายชื่อผู้ใช้ได้");
    }

    return data.map((item: any) => ({
      uid: item.firebase_uid || item.uid || "",
      email: item.email || "",
      role: item.role || "",
      createdAt: item.created_at || "",
      updatedAt: item.updated_at || "",
      emailVerified: false,
    }));
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw new Error("ไม่พบข้อมูลผู้ใช้ที่เข้าสู่ระบบ");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        throw new Error("รหัสผ่านเดิมไม่ถูกต้อง");
      }
      if (err.code === "auth/weak-password") {
        throw new Error("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      }
      throw new Error(err.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    }
  }
}
