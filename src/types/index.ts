export interface Movie {
  id: number;
  title: string;
  original_title: string | null;
  overview: string | null;
  genres: string[];
  year: number | null;
  rating: number | null;
  vote_count: number;
  poster_url: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface RecommendationItem {
  movie_id: number;
  title: string | null;
  score: number | null;
  source: string;
}