package openlibrary

import (
	"reflect"
	"testing"
)

var (
	expectedBook = Book{
		Title:         "Berserk Deluxe Volume 1",
		NumberOfPages: 696,
		AuthorLinks: []AuthorLink{
			{Key: "/authors/OL1420926A"},
			{Key: "/authors/OL3105377A"},
		},
		Covers: []int{8746964},
	}
)

func TestGetBook(t *testing.T) {
	type args struct {
		isbn int
	}
	tests := []struct {
		name    string
		args    args
		want    *Book
		wantErr bool
	}{
		{name: "test_normal_fetch", args: args{9781506711980}, want: &expectedBook, wantErr: false},
		{name: "test_failed_fetch", args: args{978150671198}, want: nil, wantErr: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetBook(tt.args.isbn)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetBook() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetBook() = %v, want %v", got, tt.want)
			}
		})
	}
}
