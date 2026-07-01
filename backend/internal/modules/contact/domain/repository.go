package domain

import "context"

type ContactSubmissionRepository interface {
	Create(ctx context.Context, s *ContactSubmission) error
	List(ctx context.Context) ([]*ContactSubmission, error)
	GetByID(ctx context.Context, id string) (*ContactSubmission, error)
	Update(ctx context.Context, s *ContactSubmission) error
}
