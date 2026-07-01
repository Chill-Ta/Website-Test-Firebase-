package application

import "time"

type SubmitContactInput struct {
	Name      string  `json:"name" validate:"required"`
	StudentID *string `json:"studentId"` // optional
	Email     string  `json:"email" validate:"required,email"`
	Category  string  `json:"category" validate:"required"`
	Message   string  `json:"message" validate:"required"`
}

type SubmitContactOutput struct {
	ID string `json:"id"`
}

type ContactItem struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	StudentID *string   `json:"studentId,omitempty"`
	Email     string    `json:"email"`
	Category  string    `json:"category"`
	Message   string    `json:"message"`
	Status    string    `json:"status"`
	Reply     string    `json:"reply"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ReplyContactInput struct {
	Status string `json:"status" validate:"required"`
	Reply  string `json:"reply"`
}
