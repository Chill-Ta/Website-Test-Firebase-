package application

import (
	"context"

	"login-firebase/internal/modules/review/domain"
)

type ApproveReview struct {
	repo domain.ReviewRepository
}

func NewApproveReview(repo domain.ReviewRepository) *ApproveReview {
	return &ApproveReview{repo: repo}
}

func (uc *ApproveReview) Execute(ctx context.Context, id string) error {
	return uc.repo.UpdateStatus(ctx, id, "approved")
}
