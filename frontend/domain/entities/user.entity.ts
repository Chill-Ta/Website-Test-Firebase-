export interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  role?: string; // "student" | "admin"
}

