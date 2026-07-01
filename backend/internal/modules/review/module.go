package review

import (
	"cloud.google.com/go/firestore"

	"login-firebase/internal/modules/review/application"
	fsrepo "login-firebase/internal/modules/review/infrastructure/persistence/firestore"
	"login-firebase/internal/modules/review/interface/rest"
)

type Module struct {
	Handler *rest.ReviewHandler
}

func New(client *firestore.Client) *Module {
	repo := fsrepo.NewFirestoreRepository(client)
	listUC := application.NewListReviews(repo)
	approveUC := application.NewApproveReview(repo)
	deleteUC := application.NewDeleteReview(repo)
	handler := rest.NewReviewHandler(listUC, approveUC, deleteUC)

	return &Module{Handler: handler}
}
