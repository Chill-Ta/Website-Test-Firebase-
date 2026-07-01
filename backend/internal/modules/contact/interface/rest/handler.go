package rest

import (
	"github.com/gofiber/fiber/v3"

	"login-firebase/internal/modules/contact/application"
	"login-firebase/internal/platform/apperr"
)

type ContactSubmissionHandler struct {
	submit *application.SubmitContact
	list   *application.ListContacts
	reply  *application.ReplyContact
}

func NewContactSubmissionHandler(
	submit *application.SubmitContact,
	list *application.ListContacts,
	reply *application.ReplyContact,
) *ContactSubmissionHandler {
	return &ContactSubmissionHandler{
		submit: submit,
		list:   list,
		reply:  reply,
	}
}

func (h *ContactSubmissionHandler) Submit(c fiber.Ctx) error {
	var in application.SubmitContactInput
	if err := c.Bind().Body(&in); err != nil {
		return apperr.Validation("invalid request body", err.Error())
	}

	out, err := h.submit.Execute(c.Context(), in)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    out,
	})
}

func (h *ContactSubmissionHandler) List(c fiber.Ctx) error {
	out, err := h.list.Execute(c.Context())
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    out,
	})
}

func (h *ContactSubmissionHandler) Update(c fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return apperr.Validation("missing id parameter", "")
	}

	var in application.ReplyContactInput
	if err := c.Bind().Body(&in); err != nil {
		return apperr.Validation("invalid request body", err.Error())
	}

	err := h.reply.Execute(c.Context(), id, in)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "บันทึกการแก้ไขเรียบร้อยแล้ว",
	})
}
