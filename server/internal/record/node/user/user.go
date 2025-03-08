package user

type User struct {
	Parents []string
	Children []string
	Name string
}

func (u *User) Parents() []string {
	return u.Parents
}

func (u *User) Children() []string {
	return u.Children
}

