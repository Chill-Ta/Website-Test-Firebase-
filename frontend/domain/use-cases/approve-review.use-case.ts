import { ReviewRepository } from "../repositories/review.repository";

export class ApproveReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(idToken: string, id: string): Promise<void> {
    return this.reviewRepository.approveReview(idToken, id);
  }
}
