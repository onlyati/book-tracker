package openlibrary

import "testing"

var (
	author1 = Author{}
	author2 = Author{Name: "Dummy Jonson"}
	author3 = Author{Name: "Dummy Jonson"}
	book1   = Book{}
	book2   = Book{Title: "Dummy title"}
	book3   = Book{Title: "Dummy title"}
)

func TestAuthor_Equals(t *testing.T) {
	type fields struct {
		Name           string
		AlternateNames []string
		PersonalName   string
		Key            string
	}
	type args struct {
		other Author
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		want   bool
	}{
		{name: "test_not_equal", fields: fields(author1), args: args{author2}, want: false},
		{name: "test_equal", fields: fields(author2), args: args{author3}, want: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			a := &Author{
				Name:           tt.fields.Name,
				AlternateNames: tt.fields.AlternateNames,
				PersonalName:   tt.fields.PersonalName,
				Key:            tt.fields.Key,
			}
			if got := a.Equals(tt.args.other); got != tt.want {
				t.Errorf("Author.Equals() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestBook_Equals(t *testing.T) {
	type fields struct {
		Title         string
		NumberOfPages int
		Covers        []int
		AuthorLinks   []AuthorLink
	}
	type args struct {
		other Book
	}
	tests := []struct {
		name   string
		fields fields
		args   args
		want   bool
	}{
		{name: "test_not_equal", fields: fields(book1), args: args{book2}, want: false},
		{name: "test_equal", fields: fields(book2), args: args{book3}, want: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b := &Book{
				Title:         tt.fields.Title,
				NumberOfPages: tt.fields.NumberOfPages,
				Covers:        tt.fields.Covers,
				AuthorLinks:   tt.fields.AuthorLinks,
			}
			if got := b.Equals(tt.args.other); got != tt.want {
				t.Errorf("Book.Equals() = %v, want %v", got, tt.want)
			}
		})
	}
}
