package application

import (
	"context"

	"login-firebase/internal/modules/review/domain"
)

type DeleteReview struct {
	repo domain.ReviewRepository
}

func NewDeleteReview(repo domain.ReviewRepository) *DeleteReview {
	return &DeleteReview{repo: repo}
}

func (uc *DeleteReview) Execute(ctx context.Context, id string) error {
	return uc.repo.Delete(ctx, id)
}
