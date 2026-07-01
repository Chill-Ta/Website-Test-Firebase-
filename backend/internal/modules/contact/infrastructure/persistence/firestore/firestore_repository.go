package firestore

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"login-firebase/internal/modules/contact/domain"
)

type firestoreRepository struct {
	client *firestore.Client
}

func NewFirestoreRepository(client *firestore.Client) domain.ContactSubmissionRepository {
	return &firestoreRepository{client: client}
}

func (r *firestoreRepository) Create(ctx context.Context, s *domain.ContactSubmission) error {
	var docRef *firestore.DocumentRef
	if s.ID != "" {
		docRef = r.client.Collection("contact_submissions").Doc(s.ID)
	} else {
		docRef = r.client.Collection("contact_submissions").NewDoc()
		s.ID = docRef.ID
	}

	if s.Status == "" {
		s.Status = "pending"
	}

	data := map[string]interface{}{
		"id":         s.ID,
		"name":       s.Name,
		"email":      s.Email,
		"category":   s.Category,
		"message":    s.Message,
		"status":     s.Status,
		"reply":      s.Reply,
		"created_at": s.CreatedAt,
		"updated_at": s.UpdatedAt,
	}

	if s.StudentID != nil {
		data["student_id"] = *s.StudentID
	} else {
		data["student_id"] = nil
	}

	_, err := docRef.Set(ctx, data)
	return err
}

func (r *firestoreRepository) List(ctx context.Context) ([]*domain.ContactSubmission, error) {
	col := r.client.Collection("contact_submissions")
	q := col.OrderBy("created_at", firestore.Desc)
	iter := q.Documents(ctx)
	defer iter.Stop()

	var items []*domain.ContactSubmission
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		data := doc.Data()
		var s domain.ContactSubmission
		if id, ok := data["id"].(string); ok {
			s.ID = id
		}
		if name, ok := data["name"].(string); ok {
			s.Name = name
		}
		if email, ok := data["email"].(string); ok {
			s.Email = email
		}
		if category, ok := data["category"].(string); ok {
			s.Category = category
		}
		if message, ok := data["message"].(string); ok {
			s.Message = message
		}
		if status, ok := data["status"].(string); ok {
			s.Status = status
		} else {
			s.Status = "pending"
		}
		if reply, ok := data["reply"].(string); ok {
			s.Reply = reply
		}
		if studentID, ok := data["student_id"].(string); ok {
			s.StudentID = &studentID
		}
		if ca, ok := data["created_at"].(time.Time); ok {
			s.CreatedAt = ca
		}
		if ua, ok := data["updated_at"].(time.Time); ok {
			s.UpdatedAt = ua
		}

		items = append(items, &s)
	}
	return items, nil
}

func (r *firestoreRepository) GetByID(ctx context.Context, id string) (*domain.ContactSubmission, error) {
	doc, err := r.client.Collection("contact_submissions").Doc(id).Get(ctx)
	if err != nil {
		return nil, err
	}
	data := doc.Data()
	var s domain.ContactSubmission
	s.ID = id
	if name, ok := data["name"].(string); ok {
		s.Name = name
	}
	if email, ok := data["email"].(string); ok {
		s.Email = email
	}
	if category, ok := data["category"].(string); ok {
		s.Category = category
	}
	if message, ok := data["message"].(string); ok {
		s.Message = message
	}
	if status, ok := data["status"].(string); ok {
		s.Status = status
	} else {
		s.Status = "pending"
	}
	if reply, ok := data["reply"].(string); ok {
		s.Reply = reply
	}
	if studentID, ok := data["student_id"].(string); ok {
		s.StudentID = &studentID
	}
	if ca, ok := data["created_at"].(time.Time); ok {
		s.CreatedAt = ca
	}
	if ua, ok := data["updated_at"].(time.Time); ok {
		s.UpdatedAt = ua
	}
	return &s, nil
}

func (r *firestoreRepository) Update(ctx context.Context, s *domain.ContactSubmission) error {
	data := map[string]interface{}{
		"status":     s.Status,
		"reply":      s.Reply,
		"updated_at": s.UpdatedAt,
	}
	_, err := r.client.Collection("contact_submissions").Doc(s.ID).Set(ctx, data, firestore.MergeAll)
	return err
}
