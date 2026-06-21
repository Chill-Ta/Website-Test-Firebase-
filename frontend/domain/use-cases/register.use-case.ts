import { AuthRepository } from "../repositories/auth.repository";

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<{ message: string }> {
    return this.authRepository.register(email, password);
  }
}
