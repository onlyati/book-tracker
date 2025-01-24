package db

import "gorm.io/gorm"

//
// Create
//

func CreateCategoryService(db *gorm.DB, name string) (*Category, error) {
	var deletedCategory Category
	err := db.Unscoped().Where("name = ?", name).Find(&deletedCategory).Error
	if err != nil {
		return nil, err
	}

	// This has been soft deleted, just set "deleted_at" to null
	if deletedCategory.Name != "" {
		err := db.Unscoped().Model(&Category{}).Where("id = ?", deletedCategory.ID).Update("deleted_at", nil).Error
		if err != nil {
			return nil, err
		}

		return &deletedCategory, nil
	}

	// Add brand new category
	category := Category{
		Name: name,
	}
	err = db.Where("name = ?", name).FirstOrCreate(&category).Error
	if err != nil {
		return nil, err
	}

	return &category, nil
}

//
// Read
//

func ListCategoriesService(db *gorm.DB, index uint64) ([]Category, error) {
	var categories []Category
	err := db.Unscoped().Where("id > ?", index).Limit(10).Find(&categories).Error
	if err != nil {
		return nil, err
	}

	return categories, nil
}

func ReadCategoryService(db *gorm.DB, name string) (*Category, error) {
	var category Category
	err := db.Unscoped().Where("name = ?", name).Find(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, err
}

//
// Update
//

func UpdateCategoryService(db *gorm.DB, id uint64, newName string) (*Category, error) {
	var category Category
	err := db.Where("id = ?", id).First(&category).Error
	if err != nil {
		return nil, err
	}

	category.Name = newName
	err = db.Save(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

//
// Delete
//

func DeleteCategoryService(db *gorm.DB, id uint64) error {
	err := db.Where("id = ?", id).Delete(&Category{}).Error
	return err
}
