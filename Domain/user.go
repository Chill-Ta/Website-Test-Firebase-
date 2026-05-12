package domain

import "time"

type User struct {
	FirebaseUID string    `firestore:"firebase_uid"`
	Email       string    `firestore:"email"`
	CreatedAt   time.Time `firestore:"created_at"`
	UpdatedAt   time.Time `firestore:"updated_at"`
}

type LoginRequest struct {
	IDToken string `json:"id_token"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserRepository interface {
	GetByEmail(email string) (*User, error)
	CreateUser(user *User) error
}

type LoginUsecase interface {
	Authenticate(req LoginRequest) (string, error)
}

type RegisterUsecase interface {
	Register(req RegisterRequest) error
}
