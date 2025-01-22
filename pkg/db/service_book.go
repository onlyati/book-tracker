package db

import (
	"github.com/onlyati/book-tracker/pkg/openlibrary"
	"gorm.io/gorm"
)

//
// Create
//

func CreateBookService(db *gorm.DB, isbn int) (*Book, error) {
	book_raw, err := openlibrary.GetBook(isbn)
	if err != nil {
		return nil, err
	}

	book := Book{
		Title:         book_raw.Title,
		NumberOfPages: book_raw.NumberOfPages,
		Cover:         openlibrary.GetCoverFileName("L", isbn),
		ISBN:          isbn,
	}

	err = db.Transaction(func(tx *gorm.DB) error {
		err = tx.Where("isbn = ?", isbn).FirstOrCreate(&book).Error
		if err != nil {
			return err
		}

		var authors []Author
		for _, link := range book_raw.AuthorLinks {
			author, err := CreateAuthorService(tx, link.Key)
			if err != nil {
				return err
			}
			authors = append(authors, *author)
		}

		err = tx.Model(&book).Association("Authors").Append(authors)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return &book, nil
}

func AssignBookToUserService(db *gorm.DB, user_id uint64, book_id uint64) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		var book Book
		err := tx.Where("id = ?", book_id).First(&book).Error
		if err != nil {
			return err
		}

		var user User
		err = tx.Where("id = ?", user_id).First(&user).Error
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Users").Append(user)
		if err != nil {
			return err
		}

		return nil
	})
	return err
}

func AssignCategoryToUserService(db *gorm.DB, category_id uint64, book_id uint64) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		var book Book
		err := tx.Where("id = ?", book_id).First(&book).Error
		if err != nil {
			return err
		}

		var category Category
		err = tx.Where("id = ?", category_id).First(&category).Error
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Categories").Append(category)
		if err != nil {
			return err
		}

		return nil
	})
	return err
}

//
// Delete
//

func DeleteBookService(db *gorm.DB, book_id uint64) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		var book Book
		err := tx.Where("id = ?", book_id).First(&book).Error
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Users").Clear()
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Authors").Clear()
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Categories").Clear()
		if err != nil {
			return err
		}

		err = db.Where("id = ?", book_id).Delete(&book).Error
		if err != nil {
			return err
		}

		return nil
	})
	return err
}

func UnassignBookFromUserService(db *gorm.DB, book_id uint, user_id uint) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		var book Book
		err := tx.Where("id = ?", book_id).First(&book).Error
		if err != nil {
			return err
		}

		var user User
		err = tx.Where("id = ?", user_id).First(&user).Error
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Users").Delete(&user)
		if err != nil {
			return err
		}

		return nil
	})
	return err
}

func UnassignBookFromCategoryService(db *gorm.DB, book_id uint, category_id uint) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		var book Book
		err := tx.Where("id = ?", book_id).First(&book).Error
		if err != nil {
			return err
		}

		var category Category
		err = tx.Where("id = ?", category_id).First(&category).Error
		if err != nil {
			return err
		}

		err = tx.Model(&book).Association("Categories").Delete(&category)
		if err != nil {
			return err
		}

		return nil
	})
	return err
}
