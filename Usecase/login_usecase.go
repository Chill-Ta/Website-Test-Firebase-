package usecases

import (
	"context"
	"errors"
	domain "login-firebase/Domain"

	"firebase.google.com/go/v4/auth"
)

type loginUsecase struct {
	userRepo     domain.UserRepository
	firebaseAuth *auth.Client
}

func NewLoginUsecase(repo domain.UserRepository, firebaseAuth *auth.Client) domain.LoginUsecase {
	return &loginUsecase{
		userRepo:     repo,
		firebaseAuth: firebaseAuth,
	}
}

func (u *loginUsecase) Authenticate(req domain.LoginRequest) (string, error) {
	ctx := context.Background()

	// 1. Verify Firebase ID Token
	token, err := u.firebaseAuth.VerifyIDToken(ctx, req.IDToken)
	if err != nil {
		return "", errors.New("token ไม่ถูกต้อง")
	}

	// 2. ดึง email จาก token
	email, ok := token.Claims["email"].(string)
	if !ok {
		return "", errors.New("ไม่พบอีเมลใน token")
	}

	// 3. เช็คว่ามี user ใน Firestore ไหม
	_, err = u.userRepo.GetByEmail(email)
	if err != nil {
		return "", errors.New("ไม่พบผู้ใช้ในระบบ")
	}

	return token.UID, nil
}
