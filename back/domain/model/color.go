package model

import (
	"fmt"
)

type Color struct {
	Red int
	Green int
	Blue int
}

func (c *Color) ToHexString() string {
	return fmt.Sprintf("0x%x%x%x", c.Red, c.Green, c.Blue)
}