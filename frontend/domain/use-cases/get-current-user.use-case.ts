import { AuthRepository } from "../repositories/auth.repository";
import { User } from "../entities/user.entity";

export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): User | null {
    return this.authRepository.getCurrentUser();
  }

  subscribe(callback: (user: User | null) => void): () => void {
    return this.authRepository.onAuthStateChanged(callback);
  }
}
