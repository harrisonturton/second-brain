package engine

var (
	What = []string{
		"What is {{.Query}}?",
		//"What does {{.Query}} do?",
		//"What are some key features of {{.Query}}?",
		//"What functions does {{.Query}} have?",
		//"How would someone use {{.Query}}?",
	}

	Why = []string{
		"What is the purpose of {{.Query}}?",
		//"What led to the development of {{.Query}}?",
		//"What did {{.Query}} replace?",
		//"Why was {{.Query}} made?",
		//"Why is {{.Query}} made today?",
		//"Why do people use {{.Query}}?",
		//"Why do people like {{.Query}}?",
	}

	Examples = []string{
		"Give me examples of {{.Query}}.",
		//"Give me examples of popular {{.Query}} from the past 10 years.",
		//"Give me examples of popular {{.Query}} from the past 100 years.",
		//"Give me examples of {{.Query}} from the past 10 years designed in the United States.",
		//"Give me examples of {{.Query}} from the past 10 years designed in Europe.",
		//"Give me examples of {{.Query}} from the past 10 years designed in Asia.",
	}

	Analogies = []string{
		"Give me 5 examples of things similar to {{.Query}} and why they are similar.",
		//"Explain what {{.Query}} is in terms of the examples.",
	}

	When = []string{
		"What is the history of {{.Query}}?",
		//"What are notable moments in the history of {{.Query}}?",
		//"Give me a timeline of the history of {{.Query}}.",
		//"What are the key events in the history of {{.Query}}?",
		//"What are the key events in the past 10 years for {{.Query}}?",
		//"What are the key events in the past 100 years for {{.Query}}?",
		//"What are the key developments in the history of {{.Query}}?",
		//"What are the key developments in the past 10 years for {{.Query}}?",
		//"What are the key developments in the past 100 years for {{.Query}}?",
	}

	Where = []string{
		"Where is {{.Query}} made today?",
		//"Where was {{.Query}} made in the 20th century?",
		//"Where was {{.Query}} developed originally?",
		//"Where is {{.Query}} manufactured today?",
		//"In what countries did key developments in {{.Query}} happen?",
	}

	Who = []string{
		"Who is the target demographic for {{.Query}} today?",
		//"Who are the target demographics for different types of {{.Query}} over the past 10 years?",
		//"Who are the key people in the history of {{.Query}}?",
		//"Who are key people in the present day for {{.Query}}?",
	}

	How = []string{
		"How was {{.Query}} developed over the past 10 years?",
		//"How was {{.Query}} manufactured over the past 10 years?",
		//"How was {{.Query}} developed over the past 100 years?",
		//"How was {{.Query}} manufactured over the past 100 years?",
	}

	Up = []string{
		"What systems are {{.Query}} used in?",
	}

	Across = []string{
		"What does {{.Query}} replace?",
		//"What can I use instead of {{.Query}}?",
	}

	Down = []string{
		"What is {{.Query}} made of?",
		//"What is {{.Query}} made of today?",
		//"What are the key components of {{.Query}}?",
		//"What are the key engineering challenges of {{.Query}}?",
		//"What is the manufacturing process of {{.Query}}?",
	}
)
