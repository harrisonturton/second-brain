package concept

type Concept struct {
	Parents []string
	Children []string
	Concept string
	Summary Summary
}

func (c *Concept) Parents() []string {
	return c.Parents
}

func (c *Concept) Children() []string {
	return c.Children
}

type Summary struct {
	What string
	Why string
	Examples string
	Analogies string
	When string
	Where string
	Who string
	How string
	Up string
	Across string
	Down string

	WhatChildren []string
	WhyChildren []string
	ExamplesChildren []string
	AnalogiesChildren []string
	WhenChildren []string
	WhereChildren []string
	WhoChildren []string
	HowChildren []string
	UpChildren []string
	AcrossChildren []string
	DownChildren []string
}
