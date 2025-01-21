package node

type Node interface {
	Parents() []string
	Children() []string
}

