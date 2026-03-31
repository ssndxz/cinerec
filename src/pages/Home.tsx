import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { MovieCard } from '../components/MovieCard';

export const Home = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuth = !!localStorage.getItem('access_token');

  useEffect(() => {
    const fetchHomeMovies = async () => {
      try {
        // Get personal if auth, otherwise trending
        const { data } = isAuth 
          ? await apiService.getPersonal() 
          : await apiService.getTrending();
        
        // Fetch full movie details for each recommendation item
        const fullMovies = await Promise.all(
          data.items.map(async (item: any) => {
            try {
              const movieRes = await apiService.getMovie(item.movie_id);
              // Add source info to the movie data for later use in MovieCard
              return { ...movieRes.data, source: item.source };
            } catch {
              return item; // If fails, return the original item with min info
            }
          })
        );
        
        setMovies(fullMovies);
      } catch (err) { 
        console.error(err); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeMovies();
  }, [isAuth]);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] text-xl text-slate-400">
      Подбираем лучшие фильмы для вас...
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        {isAuth ? 'Рекомендовано для вас' : 'Сейчас в тренде'}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m, idx) => (
          <MovieCard key={m.id || m.movie_id || idx} movie={m} />
        ))}
      </div>
    </div>
  );
};