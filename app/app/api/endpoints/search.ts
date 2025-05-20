import axios from 'axios';
import {Concept, ConceptGraph} from "@/app/search/types";
import {concept1, conceptGraph} from "@/app/fakes";

interface SearchResponse {
  sessionId: string;
  concept: Concept;
  conceptGraph: ConceptGraph;
  history: Concept[];
}

const stubResponse: SearchResponse = {
  sessionId: "session-id",
  concept: concept1,
  conceptGraph: conceptGraph,
  history: [concept1]
};

export async function search(
  query: string, 
  sessionId: string | null,
  fakeMode: boolean = false
): Promise<SearchResponse> {
  if (fakeMode) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return stubResponse;
  }

  try {
    const response = await axios.get('/api/search', {
      params: {
        query,
        sessionId
      },
      // Disable caching for testing purposes
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
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
