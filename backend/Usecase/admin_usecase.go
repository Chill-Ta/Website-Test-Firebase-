package usecases

import (
	domain "login-firebase/Domain"
)

type adminUsecase struct {
	userRepo domain.UserRepository
}

func NewAdminUsecase(userRepo domain.UserRepository) domain.AdminUsecase {
	return &adminUsecase{
		userRepo: userRepo,
	}
}

func (u *adminUsecase) GetAllUsers() ([]*domain.User, error) {
	return u.userRepo.GetAllUsers()
}
