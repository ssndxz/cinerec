import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { MovieCard } from '../components/MovieCard';

export const Home = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [topN, setTopN] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await apiService.getTrending(20);
        const rawItems = res.data.items || [];
        
        const uniqueItems = Array.from(new Map(rawItems.map((m: any) => [m.id || m.movie_id, m])).values());
        
        const fullMovies = await Promise.all(
          (uniqueItems as any[]).map(async (item: any) => {
            try { return (await apiService.getMovie(item.movie_id || item.id)).data; } 
            catch { return item; }
          })
        );
        setMovies(fullMovies);
        if (rawItems.length < 20) setHasMore(false);
      } catch (err) {
        console.error('Ошибка загрузки каталога:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const loadMore = async () => {
    setLoading(true);
    const nextTopN = topN + 20;
    
    try {
      const res = await apiService.getTrending(nextTopN);
      const allItems = res.data.items || [];
      
      const existingIds = new Set(movies.map(m => m.id || m.movie_id));
      const newItems = allItems.filter((item: any) => !existingIds.has(item.id || item.movie_id));

      if (newItems.length > 0) {
        const enrichedNew = await Promise.all(
          newItems.map(async (item: any) => {
            try { return (await apiService.getMovie(item.movie_id || item.id)).data; } 
            catch { return item; }
          })
        );
        setMovies(prev => [...prev, ...enrichedNew]);
      }
      
      setTopN(nextTopN);
      if (allItems.length < nextTopN) setHasMore(false);
    } catch (err) {
      console.error('Ошибка загрузки следующей страницы:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {movies.length === 0 && loading ? (
        <div className="text-center mt-20 text-slate-400 animate-pulse text-lg">Загрузка каталога...</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-8">Популярные фильмы</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id || movie.movie_id} movie={movie} />
            ))}
          </div>

          {hasMore && movies.length > 0 && (
            <div className="flex justify-center mt-12 mb-8">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-10 rounded-full transition shadow-lg"
              >
                {loading ? 'Загрузка...' : 'Загрузить еще'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};