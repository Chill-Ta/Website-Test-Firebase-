package application

import (
	"context"

	"login-firebase/internal/modules/contact/domain"
)

type ListContacts struct {
	repo domain.ContactSubmissionRepository
}

func NewListContacts(repo domain.ContactSubmissionRepository) *ListContacts {
	return &ListContacts{repo: repo}
}

func (uc *ListContacts) Execute(ctx context.Context) ([]ContactItem, error) {
	items, err := uc.repo.List(ctx)
	if err != nil {
		return nil, err
	}

	output := make([]ContactItem, len(items))
	for i, s := range items {
		var studentID *string
		if s.StudentID != nil {
			val := *s.StudentID
			studentID = &val
		}
		output[i] = ContactItem{
			ID:        s.ID,
			Name:      s.Name,
			StudentID: studentID,
			Email:     s.Email,
			Category:  s.Category,
			Message:   s.Message,
			Status:    s.Status,
			Reply:     s.Reply,
			CreatedAt: s.CreatedAt,
			UpdatedAt: s.UpdatedAt,
		}
	}
	return output, nil
}
