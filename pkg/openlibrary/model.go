package openlibrary

import (
	"reflect"
)

type Author struct {
	Name           string   `json:"name"`
	AlternateNames []string `json:"alternate_names"`
	PersonalName   string   `json:"personal_name"`
	Key            string   `json:"-"`
}

func (a *Author) Equals(other Author) bool {
	if (a.Name != other.Name) ||
		(!reflect.DeepEqual(a.AlternateNames, other.AlternateNames)) ||
		(a.PersonalName != other.PersonalName) ||
		(a.Key != other.Key) {
		return false
	}
	return true
}

type AuthorLink struct {
	Key string `json:"key"`
}

type Book struct {
	Title         string       `json:"title"`
	NumberOfPages int          `json:"number_of_pages"`
	Covers        []int        `json:"covers"`
	AuthorLinks   []AuthorLink `json:"authors"`
}

func (b *Book) Equals(other Book) bool {
	if (b.Title != other.Title) ||
		(b.NumberOfPages != other.NumberOfPages) ||
		(!reflect.DeepEqual(b.Covers, other.Covers)) ||
		(!reflect.DeepEqual(b.AuthorLinks, other.AuthorLinks)) {
		return false
	}
	return true
}
