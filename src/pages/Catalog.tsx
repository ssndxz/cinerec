import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Search } from 'lucide-react';

export const Catalog = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const loadMovies = async (q?: string) => {
  try {
    if (q) {
      const res = await apiService.searchMovies(q);
      setMovies(res.data || []);
    } else {
      const res = await apiService.getMovies();
      setMovies(res.data?.items || []);
    }
  } catch (error) {
    console.error(error);
    setMovies([]);
  }
};

  useEffect(() => { loadMovies(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length >= 3 || val.length === 0) {
      loadMovies(val);
    }
  };

  return (
    <div className="p-6">
      <div className="relative mb-8 max-w-2xl mx-auto">
        <input 
          type="text" 
          placeholder="Введите минимум 3 символа..." 
          className="w-full p-4 pl-12 rounded-full bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none transition"
          value={query}
          onChange={handleSearch}
        />
        <Search className="absolute left-4 top-4 text-slate-500" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  );
};