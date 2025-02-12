package db

import (
	"time"

	"github.com/lib/pq"
)

type Model struct {
	ID        uint64    `gorm:"primarykey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Author struct {
	Model
	Name           string         `json:"name" gorm:"type:text"`
	AlternateNames pq.StringArray `json:"alternate_names" gorm:"type:text[]"`
	Key            string         `json:"-" gorm:"unique; not null;type: text"`
	Books          []*Book        `json:"-" gorm:"many2many:author_books"`
}

type Book struct {
	Model
	Title         string      `json:"title" gorm:"type:text"`
	NumberOfPages int         `json:"number_of_pages"`
	Cover         string      `json:"cover"`
	Authors       []*Author   `json:"authors" gorm:"many2many:author_books"`
	Users         []*User     `json:"users" gorm:"many2many:user_books"`
	Categories    []*Category `json:"categories" gorm:"many2many:category_books"`
	ISBN          uint64      `json:"isbn"`
}

type Category struct {
	Model
	Name  string  `json:"name"`
	Books []*Book `json:"-" gorm:"many2many:category_books"`
}

type User struct {
	Model
	Name  string  `json:"name" gorm:"unique"`
	Books []*Book `json:"-" gorm:"many2many:users_books"`
}
