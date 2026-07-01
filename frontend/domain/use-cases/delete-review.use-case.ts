import { ReviewRepository } from "../repositories/review.repository";

export class DeleteReviewUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(idToken: string, id: string): Promise<void> {
    return this.reviewRepository.deleteReview(idToken, id);
  }
}
