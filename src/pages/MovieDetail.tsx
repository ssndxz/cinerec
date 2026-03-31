import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type { Movie, RecommendationItem } from '../types';
import { Star, Bookmark } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

export const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    if (id) {
      apiService.getMovie(id).then(res => setMovie(res.data));
      apiService.getSimilar(Number(id)).then(res => setSimilar(res.data.items));
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleRate = async (score: number) => {
    if (!movie) return;
    try {
      await apiService.rateMovie(movie.id, score);
      alert(`Оценка ${score} сохранена!`);
    } catch { alert("Пожалуйста, авторизуйтесь"); }
  };

  const handleWatchlist = async () => {
    if (!movie) return;
    try {
      const { data } = await apiService.toggleWatchlist(movie.id);
      alert(data.action === 'added' ? "Добавлено в список" : "Удалено из списка");
    } catch { alert("Пожалуйста, авторизуйтесь"); }
  };

  if (!movie) return <div className="p-10 text-center">Загрузка...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img src={movie.poster_url || ''} className="w-full md:w-96 rounded-xl shadow-2xl object-cover" alt={movie.title} />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-slate-400 mb-6">{movie.year} • {movie.genres.join(', ')}</p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-yellow-500 text-2xl font-bold">
              <Star fill="currentColor" /> {movie.rating?.toFixed(1) || 'N/A'}
            </div>
            <button onClick={handleWatchlist} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition">
              <Bookmark /> В список
            </button>
          </div>
          
          <p className="text-lg leading-relaxed text-slate-300 mb-8">{movie.overview}</p>
          
          <div className="bg-slate-800 p-6 rounded-xl inline-block">
            <h3 className="font-bold mb-4 text-slate-300">Оценить фильм:</h3>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button 
                  key={num} onClick={() => handleRate(num)}
                  className="w-10 h-10 rounded-full border border-slate-600 hover:bg-blue-600 hover:border-blue-600 transition"
                >{num}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 border-t border-slate-800 pt-8">Похожие фильмы</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similar.map(m => <MovieCard key={m.movie_id} movie={m} />)}
          </div>
        </div>
      )}
    </div>
  );
};