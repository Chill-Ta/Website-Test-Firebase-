package firestore

import (
	"context"
	"time"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"login-firebase/internal/modules/review/domain"
)

type firestoreRepository struct {
	client *firestore.Client
}

func NewFirestoreRepository(client *firestore.Client) domain.ReviewRepository {
	return &firestoreRepository{client: client}
}

func (r *firestoreRepository) Create(ctx context.Context, re *domain.Review) error {
	var docRef *firestore.DocumentRef
	if re.ID != "" {
		docRef = r.client.Collection("reviews").Doc(re.ID)
	} else {
		docRef = r.client.Collection("reviews").NewDoc()
		re.ID = docRef.ID
	}

	if re.Status == "" {
		re.Status = "pending"
	}
	if re.CreatedAt.IsZero() {
		re.CreatedAt = time.Now()
	}
	if re.UpdatedAt.IsZero() {
		re.UpdatedAt = time.Now()
	}

	data := map[string]interface{}{
		"id":         re.ID,
		"company":    re.Company,
		"role":       re.Role,
		"content":    re.Content,
		"author":     re.Author,
		"date":       re.Date,
		"status":     re.Status,
		"created_at": re.CreatedAt,
		"updated_at": re.UpdatedAt,
	}

	_, err := docRef.Set(ctx, data)
	return err
}

func (r *firestoreRepository) List(ctx context.Context) ([]*domain.Review, error) {
	col := r.client.Collection("reviews")
	q := col.OrderBy("created_at", firestore.Desc)
	iter := q.Documents(ctx)
	defer iter.Stop()

	var items []*domain.Review
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}

		data := doc.Data()
		var re domain.Review
		if id, ok := data["id"].(string); ok {
			re.ID = id
		}
		if company, ok := data["company"].(string); ok {
			re.Company = company
		}
		if role, ok := data["role"].(string); ok {
			re.Role = role
		}
		if content, ok := data["content"].(string); ok {
			re.Content = content
		}
		if author, ok := data["author"].(string); ok {
			re.Author = author
		}
		if date, ok := data["date"].(string); ok {
			re.Date = date
		}
		if status, ok := data["status"].(string); ok {
			re.Status = status
		}
		if ca, ok := data["created_at"].(time.Time); ok {
			re.CreatedAt = ca
		}
		if ua, ok := data["updated_at"].(time.Time); ok {
			re.UpdatedAt = ua
		}

		items = append(items, &re)
	}
	return items, nil
}

func (r *firestoreRepository) UpdateStatus(ctx context.Context, id string, status string) error {
	data := map[string]interface{}{
		"status":     status,
		"updated_at": time.Now(),
	}
	_, err := r.client.Collection("reviews").Doc(id).Set(ctx, data, firestore.MergeAll)
	return err
}

func (r *firestoreRepository) Delete(ctx context.Context, id string) error {
	_, err := r.client.Collection("reviews").Doc(id).Delete(ctx)
	return err
}

func (r *firestoreRepository) Count(ctx context.Context) (int, error) {
	col := r.client.Collection("reviews")
	// For simple count we can get the document refs iterator
	iter := col.DocumentRefs(ctx)
	count := 0
	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return 0, err
		}
		count++
	}
	return count, nil
}
