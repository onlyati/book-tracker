package db

import (
	"github.com/onlyati/book-tracker/pkg/openlibrary"
	"gorm.io/gorm"
)

//
// Create
//

func CreateAuthorService(db *gorm.DB, key string) (*Author, error) {
	authorRaw, err := openlibrary.GetAuthor(key)
	if err != nil {
		return nil, err
	}

	author := Author{
		Name:           authorRaw.Name,
		AlternateNames: authorRaw.AlternateNames,
		Key:            authorRaw.Key,
	}
	err = db.Where("key = ? ", authorRaw.Key).FirstOrCreate(&author).Error
	if err != nil {
		return nil, err
	}

	return &author, nil
}

//
// Read
//

func ListAuthorService(db *gorm.DB, index uint64) ([]Author, error) {
	var authors []Author
	err := db.Unscoped().Where("id > ?", index).Limit(10).Find(&authors).Error
	if err != nil {
		return nil, err
	}
	return authors, nil
}

func ReadAuthorService(db *gorm.DB, id uint64) (*Author, error) {
	var author Author
	err := db.Unscoped().Where("id = ?", id).First(&author).Error
	if err != nil {
		return nil, err
	}
	return &author, nil
}

//
// Delete
//

func SoftDeleteAuthorService(db *gorm.DB, id uint64) error {
	err := db.Where("id = ?", id).Delete(&Author{}).Error
	return err
}

func HardDeleteAuthorService(db *gorm.DB) error {
	var authors []Author
	err := db.Unscoped().Where("deleted_at is not null").Find(&authors).Error
	if err != nil {
		return err
	}

	if len(authors) == 0 {
		return nil
	}

	err = db.Unscoped().Delete(&authors).Error
	return err
}
