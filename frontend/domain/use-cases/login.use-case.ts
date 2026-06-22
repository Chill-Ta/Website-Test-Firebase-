import { AuthRepository } from "../repositories/auth.repository";

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<{ uid: string; idToken: string; role: string }> {
    return this.authRepository.login(email, password);
  }
}

