import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { MovieCard } from '../components/MovieCard';

export const Home = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageToLoad: number, isInitial = false) => {
    setLoading(true);
    try {
      const res = await apiService.getMovies(pageToLoad);
      const items = res.data.items || [];
      const total = res.data.total || 0;

      if (isInitial) {
        setMovies(items);
      } else {
        setMovies(prev => [...prev, ...items]);
      }

      const loadedCount = isInitial ? items.length : movies.length + items.length;
      if (loadedCount >= total || items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error('Catalog load error:', err);
      setHasMore(false);
    } {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, true);
  }, []);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Catalog of Movies</h1>
      
      {movies.length === 0 && loading ? (
        <div className="text-center mt-20 text-slate-400 animate-pulse text-lg">Loading catalog...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <MovieCard key={`${movie.id || movie.movie_id}-${index}`} movie={movie} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-12 mb-8">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-10 rounded-full transition shadow-lg"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};