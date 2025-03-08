package openai

type FakeOpenAi struct{}

func (o FakeOpenAi) callImpl(r Request) (string, error) {
	return "A car, also known as an automobile, is a wheeled motor vehicle primarily designed for " +
		"the transportation of passengers. It typically has four wheels and is powered by an " +
		"internal combustion engine or an electric motor. Cars are equipped with controls for " +
		"steering, brakes, acceleration, and various other functions. They usually have seating for " +
		"one to eight people and are used for commuting, personal travel, and transport of goods. " +
		"Cars have become an essential part of modern life due to their convenience, flexibility, " +
		"and ability to reach a wide range of destinations.", nil
}
