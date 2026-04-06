import { api } from '../api';
import type { Movie, PaginatedResponse, User, RecommendationItem } from '../types';

export const apiService = {

  // Auth
  register: (data: any) => 
    api.post('/auth/register', data),
  login: (data: any) => 
    api.post('/auth/login', data),
  getMe: (): Promise<{ data: User }> => 
    api.get('/auth/me'),

  // User
  getMyWatchlist: () => 
    api.get('/users/me/watchlist'),
  getMyRatings: () => 
    api.get('/users/me/ratings'),

  // Movies
  getMovies: (page = 1, genre?: string): Promise<{ data: PaginatedResponse<Movie> }> => 
    api.get('/movies/', { params: { page, genre } }),
  searchMovies: (query: string): Promise<{ data: Movie[] }> => 
    api.get('/movies/search', { params: { q: query } }),
  getMovie: (id: string | number): Promise<{ data: Movie }> => 
    api.get(`/movies/${id}`),
  rateMovie: (id: string | number, score: number) => 
    api.post(`/movies/${id}/rate`, { score }),
  toggleWatchlist: (id: string | number) => 
    api.post(`/movies/${id}/watchlist`),
  getMyRating: (id: string | number) => 
    api.get(`/movies/${id}/rate`),

  // Recommendations
  getPersonal: (top_n = 20): Promise<{ data: { items: RecommendationItem[] } }> => 
    api.get('/recommendations/personal', { params: { top_n } }),
  getSimilar: (id: string | number, top_n = 10): Promise<{ data: { items: RecommendationItem[] } }> => 
    api.get(`/recommendations/similar/${id}`, { params: { top_n } }),
  getTrending: (top_n = 20): Promise<{ data: { items: RecommendationItem[] } }> => 
    api.get('/recommendations/trending', { params: { top_n } })
};