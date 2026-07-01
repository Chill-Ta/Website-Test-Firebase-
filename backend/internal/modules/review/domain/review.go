package domain

import (
	"context"
	"time"
)

type Review struct {
	ID        string    `json:"id"`
	Company   string    `json:"company"`
	Role      string    `json:"role"`
	Content   string    `json:"content"`
	Author    string    `json:"author"`
	Date      string    `json:"date"`
	Status    string    `json:"status"` // "approved" or "pending"
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ReviewRepository interface {
	Create(ctx context.Context, r *Review) error
	List(ctx context.Context) ([]*Review, error)
	UpdateStatus(ctx context.Context, id string, status string) error
	Delete(ctx context.Context, id string) error
	Count(ctx context.Context) (int, error)
}
