import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type { Movie } from '../types';
import { Star, Bookmark } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isInList, setIsInList] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const loadPageDataSequential = async () => {
      setPageLoading(true);

      try {
        const movieRes = await apiService.getMovie(id);
        setMovie(movieRes.data);
      } catch (err) {
        console.error("Critical error: Movie not found in database", err);
      }

      try {
        const similarRes = await apiService.getSimilar(id);
        const rawItems = similarRes.data.items || [];
        const limitedItems = rawItems.slice(0, 5);

        const enrichedMovies = await Promise.all(
          limitedItems.map(async (item: any) => {
            try {
              const detailsRes = await apiService.getMovie(item.movie_id || item.id);
              return detailsRes.data;
            } catch {
              return item;
            }
          })
        );
        setSimilar(enrichedMovies);
      } catch (err) {
        console.error("Failed to load similar movies block:", err);
      }

      setPageLoading(false);

      const token = localStorage.getItem('access_token');
      if (token && token !== 'undefined' && token !== 'null') {
        
        try {
          const ratingRes = await apiService.getMyRating(id);
          if (ratingRes.data && ratingRes.data.score) {
            setUserRating(ratingRes.data.score);
          }
        } catch (err) {
          console.warn("User has not rated this movie yet or token is invalid.");
        }

        try {
          const watchlistRes = await apiService.getMyWatchlist(1, 100);
          const watchlistItems = watchlistRes.data.items || [];
          const isAdded = watchlistItems.some((m: any) => 
            String(m.movie_id) === String(id)
          );
          setIsInList(isAdded);
        } catch (err) {
          console.warn("Failed to verify watchlist status on server.");
        }
      }
    };

    loadPageDataSequential();
    window.scrollTo(0, 0);
  }, [id]);

  const handleRate = async (score: number) => {
    if (!movie) return;
    try {
      await apiService.rateMovie(movie.id, score);
      setUserRating(score);
    } catch { 
      alert("Session expired. Please log in again."); 
      navigate('/login');
    }
  };

  const handleWatchlist = async () => {
    if (!movie) return;
    try {
      const { data } = await apiService.toggleWatchlist(movie.id);
      setIsInList(data.action === 'added');
    } catch { 
      alert("Session expired. Please log in again."); 
      navigate('/login');
    }
  };

  if (pageLoading) return <div className="p-10 text-center text-slate-400 animate-pulse text-xl">Loading movie information...</div>;
  if (!movie) return <div className="p-10 text-center text-red-400 text-xl">Movie profile not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img 
          src={movie.poster_url || 'https://via.placeholder.com/500x750/1e293b/ffffff?text=No+Poster'} 
          className="w-full md:w-96 rounded-xl shadow-2xl object-cover h-[500px]" 
          alt={movie.title} 
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 text-white">{movie.title}</h1>
          <p className="text-slate-400 mb-6">{movie.year} • {movie.genres?.join(', ')}</p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-yellow-500 text-2xl font-bold bg-slate-800/50 px-3 py-1.5 rounded-lg border border-yellow-500/20">
              <Star fill="currentColor" size={24} /> {movie.rating?.toFixed(1) || 'N/A'}
            </div>
            
            <button 
              onClick={handleWatchlist} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isInList 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              <Bookmark fill={isInList ? "currentColor" : "none"} size={20} /> 
              {isInList ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
          
          <p className="text-lg leading-relaxed text-slate-300 mb-8">{movie.overview}</p>
          
          <div className="bg-slate-800 p-6 rounded-xl inline-block border border-slate-700 shadow-lg">
            <h3 className="font-bold mb-4 text-slate-300">Rate this movie:</h3>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                const isActive = (hoverRating || userRating) >= num;
                return (
                  <button 
                    key={num} 
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(num)}
                    className={`w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center font-bold ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.6)] scale-110' 
                        : 'border-slate-600 text-slate-400 hover:border-blue-400 hover:text-blue-400'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 border-t border-slate-800 pt-8 text-white">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similar.map((m, idx) => (
              <MovieCard key={`${m.id || m.movie_id}-${idx}`} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};