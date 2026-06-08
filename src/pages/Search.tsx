import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { MovieCard } from '../components/MovieCard';
import { Search as SearchIcon } from 'lucide-react';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setMovies([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await apiService.searchMovies(query);
        setMovies(res.data || []);
      } catch (error) {
        console.error('Search error:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <div className="relative mb-10">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        <input
          type="text"
          placeholder="Search for movies by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-5 pl-14 text-lg rounded-2xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500 transition shadow-xl text-white"
        />
      </div>

      {loading && <div className="text-center text-blue-400 text-lg animate-pulse">Searching for movies...</div>}

      {!loading && movies.length === 0 && query.trim().length >= 3 && (
        <div className="text-center text-slate-500 text-lg mt-10">No movies found for "{query}"</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};