// user graph (profile)
// user subgraph (session + history)
// central graph

package models

type Graph struct {
	AdjacencyList map[string][]string
}

