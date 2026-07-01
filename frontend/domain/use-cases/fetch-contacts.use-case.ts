import { HelpRepository } from "../repositories/help.repository";

export class FetchContactsUseCase {
  constructor(private helpRepository: HelpRepository) {}

  async execute(idToken: string): Promise<any[]> {
    return this.helpRepository.adminFetchContacts(idToken);
  }
}
