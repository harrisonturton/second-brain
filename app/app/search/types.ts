export type Concept = {
    Id?: string;
    Name: string;
    Description: string;
    Abstracts: Abstract[];
};

export type Abstract = {
    Claims: Claim[]
    Complexity: string;
}

export type Claim = {
    Body: string;
    Source: Source
}

export type Source = {
    Title: string;
    Link: string;
    Preview: string;
};

export type ConceptGraph = {
    Nodes: Concept[];
    AdjList: Concept[][];
}