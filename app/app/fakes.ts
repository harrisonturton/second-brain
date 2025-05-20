import {Abstract, Claim, Concept, ConceptGraph, Source} from "@/app/search/types";

export const source1: Source = {
    title: "brittanica.com",
    link: "brittanica.com/cars",
    preview: "Cars are a mode of transport."
}

export const source2: Source = {
    title: "wikipedia.com",
    link: "wikipedia.com/cars",
    preview: "Cars are a mode of transport used for some purposes."
}

export const source3: Source = {
    title: "cars.com",
    link: "cars.com/uses",
    preview: "Engines are a part of modern life."
}

export const source4: Source = {
    title: "transport.com",
    link: "transport.com/transport",
    preview: "A way to move things from place to place."
}

export const claim1: Claim = {
    body: "This is a low complexity claim about cars.",
    source: source1
}

export const claim2: Claim = {
    body: "This is a medium complexity claim about cars.",
    source: source2
}

export const claim3: Claim = {
    body: "This is a high complexity claim about engines.",
    source: source3
}

export const claim4: Claim = {
    body: "This is a medium complexity claim about transport.",
    source: source4
}

export const abstract1: Abstract = {
    claims: [claim1],
    complexity: "low"
}

export const abstract2: Abstract = {
    claims: [claim2],
    complexity: "medium"
}

export const abstract3: Abstract = {
    claims: [claim3],
    complexity: "medium"
}

export const abstract4: Abstract = {
    claims: [claim4],
    complexity: "medium"
}

export const placeholderConcept: Concept = {
    id: "0",
    name: "",
    description: "",
    abstracts: [{
        claims: [],
        complexity: "medium"
    }],
}

export const concept1: Concept = {
    id: "1",
    name: "Cars",
    description: "A vehicle that is able to carry a small number of people.",
    abstracts: [abstract1, abstract2],
}

export const concept2: Concept = {
    id: "2",
    name: "Engine",
    description: "A machine with moving parts that converts power into motion.",
    abstracts: [abstract3],
}

export const concept3: Concept = {
    id: "3",
    name: "Transport",
    description: "A system or means of conveying people or goods from place to place.",
    abstracts: [abstract4],
}

export const placeholderConceptGraph: ConceptGraph = {
    nodes: [placeholderConcept],
    adjList: [[]]
}

export const conceptGraph: ConceptGraph = {
    nodes: [concept1, concept2, concept3],
    adjList: [
        [concept2, concept3],
        [concept1, concept3],
        [concept1, concept2]]
}


