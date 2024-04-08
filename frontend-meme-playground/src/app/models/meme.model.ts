export interface Meme {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
    box_count: number;
    captions: number;
  }
  
  export interface MemeResponse {
    success: boolean;
    data?: {
      memes: Meme[];
    };
  }
  