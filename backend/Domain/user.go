package domain

import "time"

type User struct {
	FirebaseUID string    `firestore:"firebase_uid"`
	Email       string    `firestore:"email"`
	Role        string    `firestore:"role"`
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

// LoginResponse — ใช้สำหรับ return ข้อมูล uid และ role หลัง login สำเร็จ
type LoginResponse struct {
	UID  string `json:"uid"`
	Role string `json:"role"`
}

type UserRepository interface {
	GetByEmail(email string) (*User, error)
	GetByUID(uid string) (*User, error)
	CreateUser(user *User) error
}

type LoginUsecase interface {
	// Authenticate — return uid, role, error
	Authenticate(req LoginRequest) (string, string, error)
}

type RegisterUsecase interface {
	Register(req RegisterRequest) error
}
