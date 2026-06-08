import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export const MovieCard = ({ movie }: { movie: any }) => {
  if (!movie) return null;

  const id = movie.id || movie.movie_id || movie.movie?.id;
  const title = movie.title || movie.movie?.title || 'Untitled';
  const poster = movie.poster_url || movie.movie?.poster_url || 'https://via.placeholder.com/500x750/1e293b/ffffff?text=No+Poster';
  const year = movie.year || movie.movie?.year;
  const rating = movie.rating || movie.movie?.rating;

  return (
    <Link 
      to={`/movie/${id}`} 
      className="block bg-slate-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-xl"
    >
      <div className="w-full h-80 bg-slate-900 relative">
        <img 
          src={poster} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750/1e293b/ffffff?text=No+Poster';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate text-lg text-white">{title}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-slate-400">
          <span>{year ? year : '—'}</span>
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" /> {rating ? Number(rating).toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
};