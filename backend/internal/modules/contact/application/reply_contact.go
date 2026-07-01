package application

import (
	"context"
	"time"

	"login-firebase/internal/modules/contact/domain"
	"login-firebase/internal/platform/validator"
)

type ReplyContact struct {
	repo domain.ContactSubmissionRepository
}

func NewReplyContact(repo domain.ContactSubmissionRepository) *ReplyContact {
	return &ReplyContact{repo: repo}
}

func (uc *ReplyContact) Execute(ctx context.Context, id string, in ReplyContactInput) error {
	if err := validator.Struct(in); err != nil {
		return err
	}

	s, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	s.Status = in.Status
	s.Reply = in.Reply
	s.UpdatedAt = time.Now()

	return uc.repo.Update(ctx, s)
}
