import axios from 'axios';
import {Concept, ConceptGraph} from "@/app/search/types";
import {concept1, conceptGraph} from "@/app/fakes";

interface SearchResponse {
  SessionId: string;
  Concept: Concept;
  ConceptGraph: ConceptGraph;
  History: Concept[];
}

const stubResponse: SearchResponse = {
  SessionId: "session-id",
  Concept: concept1,
  ConceptGraph: conceptGraph,
  History: [concept1]
};

const fakeMode = false

export async function search(
  query: string, 
  sessionId: string,
): Promise<SearchResponse> {
  if (fakeMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return stubResponse;
  }

  try {
    console.log("sessionId", sessionId);
    if (sessionId === undefined || sessionId === null) {
      sessionId = "";
    }
    const response = await axios.get('http://localhost:8081/search', {
      params: {
        query,
        sessionId
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios specific errors
      throw new Error(`Search request failed: ${error.message}`);
    }
    // Handle other errors
    throw error;
  }
}
