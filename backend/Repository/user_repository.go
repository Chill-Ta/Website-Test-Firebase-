package repository

import (
	"context"
	"errors"
	domain "login-firebase/Domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type userRepository struct {
	db *firestore.Client
}

func NewUserRepository(db *firestore.Client) domain.UserRepository {
	return &userRepository{db}
}

func (r *userRepository) GetByEmail(email string) (*domain.User, error) {
	ctx := context.Background()
	iter := r.db.Collection("users").Where("email", "==", email).Limit(1).Documents(ctx)
	doc, err := iter.Next()
	if err == iterator.Done {
		return nil, errors.New("ไม่พบผู้ใช้")
	}
	if err != nil {
		return nil, err
	}

	var user domain.User
	if err := doc.DataTo(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

// GetByUID — ดึงข้อมูล user จาก Firestore โดยใช้ Firebase UID (document ID)
func (r *userRepository) GetByUID(uid string) (*domain.User, error) {
	ctx := context.Background()
	doc, err := r.db.Collection("users").Doc(uid).Get(ctx)
	if err != nil {
		return nil, errors.New("ไม่พบผู้ใช้")
	}

	var user domain.User
	if err := doc.DataTo(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) CreateUser(user *domain.User) error {
	ctx := context.Background()
	_, err := r.db.Collection("users").Doc(user.FirebaseUID).Set(ctx, user)
	return err
}
