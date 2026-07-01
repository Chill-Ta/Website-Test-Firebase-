import { HelpRepository } from "../repositories/help.repository";

export class FetchFaqsUseCase {
  constructor(private helpRepository: HelpRepository) {}

  async execute(): Promise<any[]> {
    return this.helpRepository.fetchFAQs();
  }
}
