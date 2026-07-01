package FAQ

import (
	"cloud.google.com/go/firestore"

	"login-firebase/internal/modules/FAQ/application"
	fsrepo "login-firebase/internal/modules/FAQ/infrastructure/persistence/firestore"
	"login-firebase/internal/modules/FAQ/interface/rest"
)

type Module struct {
	Handler *rest.FAQHandler
}

func New(client *firestore.Client) *Module {
	repo := fsrepo.NewFAQRepository(client)
	listUC := application.NewListFAQs(repo)
	createUC := application.NewCreateFAQ(repo)
	handler := rest.NewFAQHandler(listUC, createUC)

	return &Module{Handler: handler}
}
