export interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  role?: string; // "student" | "admin"
  firebase_uid?: string;
  createdAt?: string;
  updatedAt?: string;
}

