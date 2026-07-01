package rest

import (
	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v3"

	"login-firebase/internal/modules/user/middleware"
)

func RegisterRoutes(
	r fiber.Router,
	h *ContactSubmissionHandler,
	firebaseAuth *auth.Client,
	firestoreClient *firestore.Client,
) {
	// Public route for submitting a contact message
	r.Post("/contacts", h.Submit)

	// Admin-only routes for managing submissions
	adminGroup := r.Group("/admin/contacts", middleware.AuthMiddleware(firebaseAuth), middleware.RequireRole(firestoreClient, "admin"))
	adminGroup.Get("/", h.List)
	adminGroup.Put("/:id", h.Update)
}
