export type Concept = {
    id?: string;
    name: string;
    description: string;
    abstracts: Abstract[];
};

export type Abstract = {
    claims: Claim[]
    complexity: string;
}

export type Claim = {
    body: string;
    source: Source
}

export type Source = {
    title: string;
    link: string;
    preview: string;
};

export type ConceptGraph = {
    nodes: Concept[];
    adjList: Concept[][];
}