package db

import "gorm.io/gorm"

//
// Create
//

func CreateUserService(db *gorm.DB, name string) (*User, error) {
	var deletedUser User
	err := db.Unscoped().Where("name = ?", name).Find(&deletedUser).Error
	if err != nil {
		return nil, err
	}

	// This has been soft deleted, just set "deleted_at" to null
	if deletedUser.Name != "" {
		err := db.Unscoped().Model(&User{}).Where("id = ?", deletedUser.ID).Update("deleted_at", nil).Error
		if err != nil {
			return nil, err
		}

		return &deletedUser, nil
	}

	// Add brand new user
	user := User{
		Name: name,
	}
	err = db.Where("name = ?", name).FirstOrCreate(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

//
// Read
//

func ListUsersService(db *gorm.DB, index uint64) ([]User, error) {
	var users []User
	err := db.Unscoped().Where("id > ?", index).Limit(10).Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

func ReadUserService(db *gorm.DB, name string) (*User, error) {
	var user User
	err := db.Unscoped().Where("name = ?", name).Find(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, err
}

//
// Update
//

func UpdateUserService(db *gorm.DB, id uint64, newName string) (*User, error) {
	var user User
	err := db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}

	user.Name = newName
	err = db.Save(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

//
// Delete
//

func DeleteUserService(db *gorm.DB, id uint64) error {
	err := db.Where("id = ?", id).Delete(&User{}).Error
	return err
}

func HardDeleteUsersService(db *gorm.DB) error {
	var users []User
	err := db.Unscoped().Where("deleted_at is not null").Find(&users).Error
	if err != nil {
		return err
	}

	if len(users) == 0 {
		return nil
	}

	err = db.Unscoped().Delete(&users).Error
	return err
}
