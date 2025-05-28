package engine

import (
	"github.com/liappi/second-brain/server/internal/engine/concept"
)

type FakeEngine struct {
}

func NewFakeEngine() *FakeEngine {
	return &FakeEngine{}
}

func (f *FakeEngine) GenerateEnhancedAbstracts(query string) ([]EnhancedAbstract, []concept.ConceptGroup, error) {
	var enhancedAbstracts []EnhancedAbstract
	var conceptGroups []concept.ConceptGroup
	if query == "car" {
		enhancedAbstracts = []EnhancedAbstract{
			{
				Abstract: []string{
					"A car is a vehicle that moves on wheels.",
					"Cars are used for transportation.",
					"Most cars run on gasoline or electricity.",
				},
				References: []string{
					"https://example.com/car-basics",
					"https://example.com/transportation",
					"https://example.com/car-power",
				},
			},
			{
				Abstract: []string{
					"An automobile is a self-propelled vehicle designed for passenger transportation.",
					"Modern cars incorporate various safety features and electronic systems.",
					"The internal combustion engine converts chemical energy into mechanical energy.",
				},
				References: []string{
					"https://example.com/automobile-definition",
					"https://example.com/car-safety",
					"https://example.com/engine-principles",
				},
			},
			{
				Abstract: []string{
					"Automotive engineering involves the design and development of vehicle systems.",
					"Modern vehicles utilize computer-controlled systems for optimal performance.",
					"Hybrid powertrains combine internal combustion engines with electric motors.",
				},
				References: []string{
					"https://example.com/automotive-engineering",
					"https://example.com/vehicle-electronics",
					"https://example.com/hybrid-technology",
				},
			},
			{
				Abstract: []string{
					"Advanced driver assistance systems (ADAS) use sensors and algorithms to enhance safety.",
					"Vehicle-to-everything (V2X) communication enables cars to interact with infrastructure.",
					"Autonomous driving systems employ machine learning for real-time decision making.",
				},
				References: []string{
					"https://example.com/adas-systems",
					"https://example.com/v2x-communication",
					"https://example.com/autonomous-driving",
				},
			},
			{
				Abstract: []string{
					"Quantum computing applications in automotive design optimize material properties.",
					"Advanced aerodynamics utilize computational fluid dynamics for efficiency.",
					"Next-generation propulsion systems integrate sustainable energy solutions.",
				},
				References: []string{
					"https://example.com/quantum-automotive",
					"https://example.com/cfd-aerodynamics",
					"https://example.com/future-propulsion",
				},
			},
		}

		conceptGroups = []concept.ConceptGroup{
			{
				Name:        "Basic Components",
				Description: "Essential parts of a car",
				Concepts:    []string{"engine", "wheels", "steering"},
			},
			{
				Name:        "Types",
				Description: "Different categories of cars",
				Concepts:    []string{"sedan", "suv", "electric"},
			},
		}
	}
	if query == "suv" {
		enhancedAbstracts = []EnhancedAbstract{
			{
				Abstract: []string{
					"An SUV is a tall vehicle with more space than a regular car.",
					"SUVs are popular for families because they can carry more people and cargo.",
					"Many SUVs have four-wheel drive for better traction on rough roads.",
				},
				References: []string{
					"https://example.com/suv-basics",
					"https://example.com/suv-family",
					"https://example.com/suv-4wd",
				},
			},
			{
				Abstract: []string{
					"Sport Utility Vehicles combine passenger car comfort with off-road capability.",
					"Modern SUVs feature advanced safety systems and spacious interiors.",
					"SUV designs prioritize ground clearance and cargo capacity.",
				},
				References: []string{
					"https://example.com/suv-design",
					"https://example.com/suv-safety",
					"https://example.com/suv-capacity",
				},
			},
			{
				Abstract: []string{
					"SUV chassis design incorporates reinforced frames for enhanced durability.",
					"Advanced suspension systems provide both comfort and off-road capability.",
					"Modern SUVs utilize electronic stability control for improved handling.",
				},
				References: []string{
					"https://example.com/suv-chassis",
					"https://example.com/suv-suspension",
					"https://example.com/suv-stability",
				},
			},
			{
				Abstract: []string{
					"SUV aerodynamics balance fuel efficiency with off-road performance.",
					"Advanced terrain management systems optimize vehicle dynamics.",
					"Hybrid and electric SUVs implement sophisticated battery management systems.",
				},
				References: []string{
					"https://example.com/suv-aerodynamics",
					"https://example.com/terrain-systems",
					"https://example.com/suv-hybrid",
				},
			},
			{
				Abstract: []string{
					"Next-generation SUVs incorporate autonomous off-road navigation systems.",
					"Advanced material science enables lighter yet stronger SUV structures.",
					"Integrated vehicle-to-vehicle communication enhances off-road convoy capabilities.",
				},
				References: []string{
					"https://example.com/suv-autonomous",
					"https://example.com/suv-materials",
					"https://example.com/suv-communication",
				},
			},
		}

		conceptGroups = []concept.ConceptGroup{
			{
				Name:        "SUV Categories",
				Description: "Different types of SUVs",
				Concepts:    []string{"compact", "mid-size", "full-size", "luxury"},
			},
			{
				Name:        "SUV Features",
				Description: "Key characteristics of SUVs",
				Concepts:    []string{"4wd", "cargo-space", "ground-clearance", "seating-capacity"},
			},
		}
	}
	return enhancedAbstracts, conceptGroups, nil
}
