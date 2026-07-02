package main

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	faqModule "login-firebase/internal/modules/FAQ"
	faqRest "login-firebase/internal/modules/FAQ/interface/rest"
	contactModule "login-firebase/internal/modules/contact"
	contactRest "login-firebase/internal/modules/contact/interface/rest"
	reviewModule "login-firebase/internal/modules/review"
	reviewRest "login-firebase/internal/modules/review/interface/rest"
	"login-firebase/internal/modules/user"
	"login-firebase/internal/platform/apperr"

	firebase "firebase.google.com/go/v4"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/logger"
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

	// 4. Fiber App with custom error handling
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			var e *fiber.Error
			if errors.As(err, &e) {
				code = e.Code
			}

			var appErr *apperr.AppError
			if errors.As(err, &appErr) {
				if appErr.Type == "validation" {
					code = fiber.StatusBadRequest
				}
				log.Printf("[AppError] Type: %s, Message: %s, Detail: %s", appErr.Type, appErr.Message, appErr.Detail)
				return c.Status(code).JSON(fiber.Map{
					"success": false,
					"error":   appErr.Message,
					"detail":  appErr.Detail,
				})
			}

			log.Printf("[SystemError] Code: %d, Path: %s, Error: %v", code, c.Path(), err)
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	// 4.0 Request Logger middleware
	app.Use(logger.New())

	// 4.1 CORS — อนุญาต Frontend (Next.js) เข้าถึง API
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
	}))

	// 4.2 Rate Limiter — ป้องกัน brute force
	app.Use(limiter.New(limiter.Config{
		Max:        20,
		Expiration: 60 * time.Second,
	}))

	// 5. Register User module routes
	user.Register(app, firestoreClient, firebaseAuth)

	// 5.1 Register FAQ module routes
	faqMod := faqModule.New(firestoreClient)
	faqRest.RegisterRoutes(app, faqMod.Handler)

	// 5.2 Register Contact module routes
	contactMod := contactModule.New(firestoreClient)
	contactRest.RegisterRoutes(app, contactMod.Handler, firebaseAuth, firestoreClient)

	// 5.3 Register Review module routes
	reviewMod := reviewModule.New(firestoreClient)
	reviewRest.RegisterRoutes(app, reviewMod.Handler, firebaseAuth, firestoreClient)

	// 6. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}
