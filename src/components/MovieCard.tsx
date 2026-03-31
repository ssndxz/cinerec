import { Link } from 'react-router-dom';
import type { Movie, RecommendationItem } from '../types';
import { Star } from 'lucide-react';

export const MovieCard = ({ movie }: { movie: Movie | RecommendationItem | any }) => (
  <Link 
    to={`/movie/${movie.movie_id || movie.id}`} 
    className="block bg-slate-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-xl"
  >
    <img 
      src={movie.poster_url || 'https://placehold.co/500x750/1e293b/ffffff?text=No+Poster'} 
      alt={movie.title || 'Movie'}
      className="w-full h-80 object-cover"
    />
    <div className="p-4">
      <h3 className="font-bold truncate text-lg">{movie.title}</h3>
      {movie.year && (
        <div className="flex items-center justify-between mt-2 text-sm text-slate-400">
          <span>{movie.year}</span>
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" /> {movie.rating?.toFixed(1) || 'N/A'}
          </span>
        </div>
      )}
    </div>
  </Link>
);