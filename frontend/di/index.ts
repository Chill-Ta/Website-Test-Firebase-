import { auth } from "@/lib/firebase";
import { FirebaseAuthRepository } from "@/data/repositories/firebase-auth.repository";
import { LoginUseCase } from "@/domain/use-cases/login.use-case";
import { RegisterUseCase } from "@/domain/use-cases/register.use-case";
import { LogoutUseCase } from "@/domain/use-cases/logout.use-case";
import { GetCurrentUserUseCase } from "@/domain/use-cases/get-current-user.use-case";
import { FetchProfileUseCase } from "@/domain/use-cases/fetch-profile.use-case";

const authRepository = new FirebaseAuthRepository(auth);

export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
export const fetchProfileUseCase = new FetchProfileUseCase(authRepository);
