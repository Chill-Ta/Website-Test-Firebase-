import { HelpRepository } from "@/domain/repositories/help.repository";

export class FirebaseHelpRepository implements HelpRepository {
  private apiBase = "http://localhost:8080";

  async fetchFAQs(): Promise<any[]> {
    const res = await fetch(`${this.apiBase}/faqs/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถดึงข้อมูล FAQ ได้");
    }
    return data.data || [];
  }

  async submitContact(
    name: string,
    studentId: string | null,
    email: string,
    category: string,
    message: string
  ): Promise<void> {
    const res = await fetch(`${this.apiBase}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        studentId: studentId || null,
        email,
        category,
        message,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถส่งคำถามได้");
    }
  }

  async adminFetchContacts(idToken: string): Promise<any[]> {
    const res = await fetch(`${this.apiBase}/admin/contacts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถดึงข้อมูลข้อความได้");
    }
    return data.data || [];
  }

  async adminReplyContact(
    idToken: string,
    id: string,
    status: string,
    reply: string
  ): Promise<void> {
    const res = await fetch(`${this.apiBase}/admin/contacts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        status,
        reply,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "ไม่สามารถอัปเดตการตอบกลับได้");
    }
  }
}
