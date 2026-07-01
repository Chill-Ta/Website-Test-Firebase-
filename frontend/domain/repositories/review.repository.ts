import { Review } from "../entities/review.entity";

export interface ReviewRepository {
  fetchReviews(idToken: string): Promise<Review[]>;
  approveReview(idToken: string, id: string): Promise<void>;
  deleteReview(idToken: string, id: string): Promise<void>;
}
