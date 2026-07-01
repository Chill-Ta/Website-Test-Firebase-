export interface HelpRepository {
  fetchFAQs(): Promise<any[]>;
  submitContact(
    name: string,
    studentId: string | null,
    email: string,
    category: string,
    message: string
  ): Promise<void>;
  adminFetchContacts(idToken: string): Promise<any[]>;
  adminReplyContact(
    idToken: string,
    id: string,
    status: string,
    reply: string
  ): Promise<void>;
}
