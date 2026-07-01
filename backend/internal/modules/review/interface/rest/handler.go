package rest

import (
	"github.com/gofiber/fiber/v3"

	"login-firebase/internal/modules/review/application"
	"login-firebase/internal/platform/apperr"
)

type ReviewHandler struct {
	list    *application.ListReviews
	approve *application.ApproveReview
	delete  *application.DeleteReview
}

func NewReviewHandler(
	list *application.ListReviews,
	approve *application.ApproveReview,
	delete *application.DeleteReview,
) *ReviewHandler {
	return &ReviewHandler{
		list:    list,
		approve: approve,
		delete:  delete,
	}
}

func (h *ReviewHandler) List(c fiber.Ctx) error {
	out, err := h.list.Execute(c.Context())
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    out,
	})
}

func (h *ReviewHandler) Approve(c fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return apperr.Validation("missing id parameter", "")
	}

	err := h.approve.Execute(c.Context(), id)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "อนุมัติรีวิวสำเร็จ",
	})
}

func (h *ReviewHandler) Delete(c fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return apperr.Validation("missing id parameter", "")
	}

	err := h.delete.Execute(c.Context(), id)
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "ลบรีวิวสำเร็จ",
	})
}
