package openlibrary

import "testing"

func TestGetCover(t *testing.T) {
	type args struct {
		size string
		isbn int
		path string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{name: "test_ok_image", args: args{size: "S", isbn: 9781506711980, path: "/tmp"}, wantErr: false},
		{name: "test_ok_image", args: args{size: "M", isbn: 9781506711980, path: "/tmp"}, wantErr: false},
		{name: "test_ok_image", args: args{size: "L", isbn: 9781506711980, path: "/tmp"}, wantErr: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := GetCover(tt.args.size, tt.args.isbn, tt.args.path); (err != nil) != tt.wantErr {
				t.Errorf("GetCover() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
