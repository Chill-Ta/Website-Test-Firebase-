import { ReviewRepository } from "@/domain/repositories/review.repository";
import { Review } from "@/domain/entities/review.entity";

export class FirebaseReviewRepository implements ReviewRepository {
  private apiBase = "http://localhost:8080";

  async fetchReviews(idToken: string): Promise<Review[]> {
    const res = await fetch(`${this.apiBase}/admin/reviews`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถดึงข้อมูลรีวิวได้");
    }

    return data.data.map((item: any) => ({
      id: item.id || "",
      company: item.company || "",
      role: item.role || "",
      content: item.content || "",
      author: item.author || "",
      date: item.date || "",
      status: item.status || "pending",
      createdAt: item.created_at || "",
      updatedAt: item.updated_at || "",
    }));
  }

  async approveReview(idToken: string, id: string): Promise<void> {
    const res = await fetch(`${`${this.apiBase}/admin/reviews`}/${id}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถอนุมัติรีวิวได้");
    }
  }

  async deleteReview(idToken: string, id: string): Promise<void> {
    const res = await fetch(`${`${this.apiBase}/admin/reviews`}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถลบรีวิวได้");
    }
  }
}
