package Handler

import (
	domain "login-firebase/Domain"

	"github.com/gofiber/fiber/v3"
)

type AuthHandler struct {
	loginUsecase    domain.LoginUsecase
	registerUsecase domain.RegisterUsecase
}

func NewAuthHandler(l domain.LoginUsecase, r domain.RegisterUsecase) *AuthHandler {
	return &AuthHandler{
		loginUsecase:    l,
		registerUsecase: r,
	}
}

func (h AuthHandler) Login(c fiber.Ctx) error {
	var req domain.LoginRequest

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	uid, err := h.loginUsecase.Authenticate(req)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"uid": uid})
}

func (h AuthHandler) Register(c fiber.Ctx) error {
	var req domain.RegisterRequest

	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := h.registerUsecase.Register(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "สมัครสมาชิกสำเร็จ"})
}
