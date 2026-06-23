package Handler

import (
	domain "login-firebase/Domain"

	"github.com/gofiber/fiber/v3"
)

type AdminHandler struct {
	adminUsecase domain.AdminUsecase
}

func NewAdminHandler(u domain.AdminUsecase) *AdminHandler {
	return &AdminHandler{
		adminUsecase: u,
	}
}

func (h *AdminHandler) GetAllUsers(c fiber.Ctx) error {
	users, err := h.adminUsecase.GetAllUsers()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "ไม่สามารถดึงข้อมูลผู้ใช้ได้: " + err.Error()})
	}
	return c.JSON(users)
}
