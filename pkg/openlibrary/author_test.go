package openlibrary

import (
	"reflect"
	"testing"
)

var (
	expectedAuthor = Author{
		Name: "三浦建太郎",
		AlternateNames: []string{
			"Kentarō Miura",
			"Kentaro Miura",
		},
		PersonalName: "Kentarō Miura",
		Key:          "/authors/OL1420926A.json",
	}
)

func TestGetAuthor(t *testing.T) {
	type args struct {
		key string
	}
	tests := []struct {
		name    string
		args    args
		want    *Author
		wantErr bool
	}{
		{name: "test_normal_fetch", args: args{"/authors/OL1420926A"}, want: &expectedAuthor, wantErr: false},
		{name: "test_failed_fetch", args: args{"/authors/OL1420926"}, want: nil, wantErr: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetAuthor(tt.args.key)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetAuthor() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetAuthor() = %v, want %v", got, tt.want)
			}
		})
	}
}
