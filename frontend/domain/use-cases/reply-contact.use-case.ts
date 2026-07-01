import { HelpRepository } from "../repositories/help.repository";

export class ReplyContactUseCase {
  constructor(private helpRepository: HelpRepository) {}

  async execute(
    idToken: string,
    id: string,
    status: string,
    reply: string
  ): Promise<void> {
    if (!id || !status) {
      throw new Error("ข้อมูลระบุตัวตนหรือสถานะไม่ถูกต้อง");
    }
    return this.helpRepository.adminReplyContact(idToken, id, status, reply);
  }
}
