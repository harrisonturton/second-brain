import {Abstract, Claim, Concept, ConceptGraph, Source} from "@/app/search/types";

export const source1: Source = {
    Title: "brittanica.com",
    Link: "brittanica.com/cars",
    Preview: "Cars are a mode of transport."
}

export const source2: Source = {
    Title: "wikipedia.com",
    Link: "wikipedia.com/cars",
    Preview: "Cars are a mode of transport used for some purposes."
}

export const source3: Source = {
    Title: "cars.com",
    Link: "cars.com/uses",
    Preview: "Engines are a part of modern life."
}

export const source4: Source = {
    Title: "transport.com",
    Link: "transport.com/transport",
    Preview: "A way to move things from place to place."
}

export const claim1: Claim = {
    Body: "This is a low complexity claim about cars.",
    Source: source1
}

export const claim2: Claim = {
    Body: "This is a medium complexity claim about cars.",
    Source: source2
}

export const claim3: Claim = {
    Body: "This is a high complexity claim about engines.",
    Source: source3
}

export const claim4: Claim = {
    Body: "This is a medium complexity claim about transport.",
    Source: source4
}

export const abstract1: Abstract = {
    Claims: [claim1],
    Complexity: "0"
}

export const abstract2: Abstract = {
    Claims: [claim2],
    Complexity: "1"
}

export const abstract3: Abstract = {
    Claims: [claim3],
    Complexity: "1"
}

export const abstract4: Abstract = {
    Claims: [claim4],
    Complexity: "1"
}

export const placeholderConcept: Concept = {
    Id: "0",
    Name: "",
    Description: "",
    Abstracts: [{
        Claims: [],
        Complexity: "1"
    }],
}

export const concept1: Concept = {
    Id: "1",
    Name: "Cars",
    Description: "A vehicle that is able to carry a small number of people.",
    Abstracts: [abstract1, abstract2],
}

export const concept2: Concept = {
    Id: "2",
    Name: "Engine",
    Description: "A machine with moving parts that converts power into motion.",
    Abstracts: [abstract3],
}

export const concept3: Concept = {
    Id: "3",
    Name: "Transport",
    Description: "A system or means of conveying people or goods from place to place.",
    Abstracts: [abstract4],
}

export const placeholderConceptGraph: ConceptGraph = {
    Nodes: [placeholderConcept],
    AdjList: [[]]
}

export const conceptGraph: ConceptGraph = {
    Nodes: [concept1, concept2, concept3],
    AdjList: [
        [concept2, concept3],
        [concept1, concept3],
        [concept1, concept2]]
}


