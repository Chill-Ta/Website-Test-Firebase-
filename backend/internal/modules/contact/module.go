package contact

import (
	"cloud.google.com/go/firestore"

	"login-firebase/internal/modules/contact/application"
	fsrepo "login-firebase/internal/modules/contact/infrastructure/persistence/firestore"
	"login-firebase/internal/modules/contact/interface/rest"
)

type Module struct {
	Handler *rest.ContactSubmissionHandler
}

func New(client *firestore.Client) *Module {
	repo := fsrepo.NewFirestoreRepository(client)
	submitUC := application.NewSubmitContact(repo)
	listUC := application.NewListContacts(repo)
	replyUC := application.NewReplyContact(repo)
	handler := rest.NewContactSubmissionHandler(submitUC, listUC, replyUC)

	return &Module{Handler: handler}
}
