import { AuthRepository } from "../repositories/auth.repository";

export class ChangePasswordUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(oldPassword: string, newPassword: string): Promise<void> {
    if (!oldPassword || !newPassword) {
      throw new Error("กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่");
    }
    if (newPassword.length < 6) {
      throw new Error("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
    }
    await this.authRepository.changePassword(oldPassword, newPassword);
  }
}
