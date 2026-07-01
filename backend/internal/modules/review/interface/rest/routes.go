package rest

import (
	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v3"

	"login-firebase/internal/modules/user/middleware"
)

func RegisterRoutes(
	r fiber.Router,
	h *ReviewHandler,
	firebaseAuth *auth.Client,
	firestoreClient *firestore.Client,
) {
	// Admin-only routes for managing reviews
	adminGroup := r.Group("/admin/reviews", middleware.AuthMiddleware(firebaseAuth), middleware.RequireRole(firestoreClient, "admin"))
	adminGroup.Get("/", h.List)
	adminGroup.Put("/:id/approve", h.Approve)
	adminGroup.Delete("/:id", h.Delete)
}
