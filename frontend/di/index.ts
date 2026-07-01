import { auth } from "@/lib/firebase";
import { FirebaseAuthRepository } from "@/data/repositories/firebase-auth.repository";
import { FirebaseHelpRepository } from "@/data/repositories/firebase-help.repository";
import { LoginUseCase } from "@/domain/use-cases/login.use-case";
import { RegisterUseCase } from "@/domain/use-cases/register.use-case";
import { LogoutUseCase } from "@/domain/use-cases/logout.use-case";
import { GetCurrentUserUseCase } from "@/domain/use-cases/get-current-user.use-case";
import { FetchProfileUseCase } from "@/domain/use-cases/fetch-profile.use-case";
import { FetchUsersUseCase } from "@/domain/use-cases/fetch-users.use-case";
import { FetchFaqsUseCase } from "@/domain/use-cases/fetch-faqs.use-case";
import { SubmitContactUseCase } from "@/domain/use-cases/submit-contact.use-case";
import { FetchContactsUseCase } from "@/domain/use-cases/fetch-contacts.use-case";
import { ReplyContactUseCase } from "@/domain/use-cases/reply-contact.use-case";

export const authRepository = new FirebaseAuthRepository(auth);
const helpRepository = new FirebaseHelpRepository();

export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
export const fetchProfileUseCase = new FetchProfileUseCase(authRepository);
export const fetchUsersUseCase = new FetchUsersUseCase(authRepository);
export const fetchFaqsUseCase = new FetchFaqsUseCase(helpRepository);
export const submitContactUseCase = new SubmitContactUseCase(helpRepository);
export const fetchContactsUseCase = new FetchContactsUseCase(helpRepository);
export const replyContactUseCase = new ReplyContactUseCase(helpRepository);
