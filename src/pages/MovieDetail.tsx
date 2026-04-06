import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type { Movie } from '../types';
import { Star, Bookmark } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

export const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    if (!id) return;

    apiService.getMovie(id).then(res => setMovie(res.data));

    apiService.getSimilar(id).then(async (res) => {
      const limitedItems = (res.data.items || []).slice(0, 5);
      const fullMovies = await Promise.all(
        limitedItems.map(async (item: any) => {
          try { 
            return (await apiService.getMovie(item.movie_id || item.id)).data; 
          } catch { 
            return item; 
          }
        })
      );
      setSimilar(fullMovies);
    });

    if (localStorage.getItem('access_token')) {
      apiService.getMyRating(id)
        .then(res => {
          if (res.data && res.data.score) setUserRating(res.data.score);
        })
        .catch(() => {});

      apiService.getMyWatchlist()
        .then(res => {
          const isAdded = res.data.some((m: any) => 
            String(m.movie_id) === String(id) || String(m.id) === String(id)
          );
          setIsInList(isAdded);
        })
        .catch(() => {});
    }
    
    window.scrollTo(0, 0);
  }, [id]);

  const handleRate = async (score: number) => {
    if (!movie) return;
    try {
      await apiService.rateMovie(movie.id, score);
      setUserRating(score);
    } catch { 
      alert("Пожалуйста, авторизуйтесь"); 
    }
  };

  const handleWatchlist = async () => {
    if (!movie) return;
    try {
      const { data } = await apiService.toggleWatchlist(movie.id);
      setIsInList(data.action === 'added');
    } catch { 
      alert("Пожалуйста, авторизуйтесь"); 
    }
  };

  if (!movie) return <div className="p-10 text-center text-slate-400">Загрузка...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img src={movie.poster_url || ''} className="w-full md:w-96 rounded-xl shadow-2xl object-cover" alt={movie.title} />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-slate-400 mb-6">{movie.year} • {movie.genres.join(', ')}</p>
          
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
              {isInList ? 'В списке' : 'В список'}
            </button>
          </div>
          
          <p className="text-lg leading-relaxed text-slate-300 mb-8">{movie.overview}</p>
          
          <div className="bg-slate-800 p-6 rounded-xl inline-block border border-slate-700 shadow-lg">
            <h3 className="font-bold mb-4 text-slate-300">Оценить фильм:</h3>
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
          <h2 className="text-2xl font-bold mb-6 border-t border-slate-800 pt-8">Похожие фильмы</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similar.map(m => <MovieCard key={m.id || m.movie_id} movie={m} />)}
          </div>
        </div>
      )}
    </div>
  );
};