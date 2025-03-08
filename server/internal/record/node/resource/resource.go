package resource

type Resource struct {
	Parents []string
	Children []string
	Url string
}

func (r *Resource) Parents() []string {
	return r.Parents
}

func (r *Resource) Children() []string {
	return r.Children
}
