package validator

import (
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

// Struct validates a struct using go-playground/validator
func Struct(s interface{}) error {
	return validate.Struct(s)
}
