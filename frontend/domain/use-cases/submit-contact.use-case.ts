import { HelpRepository } from "../repositories/help.repository";

export class SubmitContactUseCase {
  constructor(private helpRepository: HelpRepository) {}

  async execute(
    name: string,
    studentId: string | null,
    email: string,
    category: string,
    message: string
  ): Promise<void> {
    if (!name.trim() || !email.trim() || !category.trim() || !message.trim()) {
      throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
    }
    return this.helpRepository.submitContact(name, studentId, email, category, message);
  }
}
