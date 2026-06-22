import { AuthRepository } from "../repositories/auth.repository";

export class FetchProfileUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<{ uid: string; message: string; role: string }> {
    const user = this.authRepository.getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    const idToken = await this.authRepository.getIdToken();
    return this.authRepository.fetchProfile(idToken);
  }
}

