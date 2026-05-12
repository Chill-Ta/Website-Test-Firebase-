package main

import (
	"context"
	"log"
	"os"

	handler "login-firebase/Handler"
	middleware "login-firebase/Middleware"
	repository "login-firebase/Repository"
	usecase "login-firebase/Usecase"

	firebase "firebase.google.com/go/v4"
	"github.com/gofiber/fiber/v3"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	// 1. เชื่อมต่อ Firebase
	opt := option.WithCredentialsFile("firebase-service-account.json")
	firebaseApp, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: "account-test-c25f0",
	}, opt)
	if err != nil {
		log.Fatal("Failed to init Firebase:", err)
	}

	// 2. Firebase Auth
	firebaseAuth, err := firebaseApp.Auth(ctx)
	if err != nil {
		log.Fatal("Failed to init Firebase Auth:", err)
	}

	// 3. Firestore
	firestoreClient, err := firebaseApp.Firestore(ctx)
	if err != nil {
		log.Fatal("Failed to init Firestore:", err)
	}
	defer firestoreClient.Close()

	// 4. Dependency Injection
	userRepo := repository.NewUserRepository(firestoreClient)
	loginUsecase := usecase.NewLoginUsecase(userRepo, firebaseAuth)
	registerUsecase := usecase.NewRegisterUsecase(userRepo, firebaseAuth)
	authHandler := handler.NewAuthHandler(loginUsecase, registerUsecase)

	// 5. Fiber App
	app := fiber.New()

	// 6. Public routes
	app.Post("/register", authHandler.Register)
	app.Post("/login", authHandler.Login)

	// 7. Protected routes (ต้อง login)
	app.Use(middleware.AuthMiddleware(firebaseAuth))

	// 8. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Fatal(app.Listen(":" + port))
}
