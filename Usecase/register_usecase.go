package usecases

import (
	"context"
	"errors"
	domain "login-firebase/Domain"
	"time"

	"firebase.google.com/go/v4/auth"
)

type registerUsecase struct {
	userRepo     domain.UserRepository
	firebaseAuth *auth.Client
}

func NewRegisterUsecase(repo domain.UserRepository, firebaseAuth *auth.Client) domain.RegisterUsecase {
	return &registerUsecase{
		userRepo:     repo,
		firebaseAuth: firebaseAuth,
	}
}

func (u *registerUsecase) Register(req domain.RegisterRequest) error {
	ctx := context.Background()

	// 1. สร้าง user ใน Firebase Auth
	params := (&auth.UserToCreate{}).
		Email(req.Email).
		Password(req.Password)

	firebaseUser, err := u.firebaseAuth.CreateUser(ctx, params)
	if err != nil {
		return errors.New("สมัครสมาชิกไม่สำเร็จ: " + err.Error())
	}

	// 2. บันทึกลง Firestore
	user := &domain.User{
		FirebaseUID: firebaseUser.UID,
		Email:       req.Email,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := u.userRepo.CreateUser(user); err != nil {
		return errors.New("บันทึกข้อมูลไม่สำเร็จ")
	}

	return nil
}
