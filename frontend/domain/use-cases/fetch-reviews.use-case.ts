import { ReviewRepository } from "../repositories/review.repository";
import { Review } from "../entities/review.entity";

export class FetchReviewsUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(idToken: string): Promise<Review[]> {
    return this.reviewRepository.fetchReviews(idToken);
  }
}
