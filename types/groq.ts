export interface GroqMatch {
  category: string;
  name: string;
  description: string;
  reasoning: string;
  confidence: number;
  image_url: string;
}

export interface GroqAnalysisResponse {
  mood: string;
  genre: string;
  matches: GroqMatch[];
}
