import { AuthRepository } from "../repositories/auth.repository";
import { User } from "../entities/user.entity";

export class FetchUsersUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User[]> {
    const user = this.authRepository.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    const idToken = await this.authRepository.getIdToken();
    return this.authRepository.fetchUsers(idToken);
  }
}
