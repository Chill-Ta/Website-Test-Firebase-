import { AuthRepository } from "../repositories/auth.repository";

export class UpdateUserRoleUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(uid: string, role: string): Promise<void> {
    const currentUser = this.authRepository.getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");
    const idToken = await this.authRepository.getIdToken();
    return this.authRepository.updateUserRole(idToken, uid, role);
  }
}
