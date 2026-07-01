export interface Review {
  id: string;
  company: string;
  role: string;
  content: string;
  author: string;
  date: string;
  status: "approved" | "pending";
  createdAt?: string;
  updatedAt?: string;
}
