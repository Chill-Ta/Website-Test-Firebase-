package apperr

import (
	"fmt"
)

// AppError represents a custom application error
type AppError struct {
	Type    string `json:"type"`
	Message string `json:"message"`
	Detail  string `json:"detail,omitempty"`
}

func (e *AppError) Error() string {
	if e.Detail != "" {
		return fmt.Sprintf("%s: %s (%s)", e.Type, e.Message, e.Detail)
	}
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

// Validation creates a new validation error
func Validation(message string, detail string) error {
	return &AppError{
		Type:    "validation",
		Message: message,
		Detail:  detail,
	}
}
