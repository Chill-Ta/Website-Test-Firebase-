package user

import (
	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v3"
	"login-firebase/internal/modules/user/application"
	userFirestore "login-firebase/internal/modules/user/infrastructure/persistence/firestore"
	"login-firebase/internal/modules/user/interface/rest"
)

func Register(router fiber.Router, db *firestore.Client, firebaseAuth *auth.Client) {
	// Initialize Repository
	userRepo := userFirestore.NewUserRepository(db)

	// Initialize Usecases
	loginUsecase := application.NewLoginUsecase(userRepo, firebaseAuth)
	registerUsecase := application.NewRegisterUsecase(userRepo, firebaseAuth)
	adminUsecase := application.NewAdminUsecase(userRepo)

	// Initialize Handlers
	authHandler := rest.NewAuthHandler(loginUsecase, registerUsecase)
	adminHandler := rest.NewAdminHandler(adminUsecase)

	// Register Routes
	rest.RegisterRoutes(router, authHandler, adminHandler, firebaseAuth, db)
}
