import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { MovieCard } from '../components/MovieCard';

export const Recommendations = () => {
  const isAuth = !!localStorage.getItem('access_token');
  const [personalRecs, setPersonalRecs] = useState<any[]>([]);
  const [topN, setTopN] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isAuth) return;

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await apiService.getPersonal(20);
        const rawItems = res.data.items || [];
        
        const uniqueItems = Array.from(new Map(rawItems.map((m: any) => [m.id || m.movie_id, m])).values());

        const fullMovies = await Promise.all(
          (uniqueItems as any[]).map(async (item: any) => {
            try { return (await apiService.getMovie(item.movie_id || item.id)).data; } 
            catch { return item; }
          })
        );
        setPersonalRecs(fullMovies);
        if (rawItems.length < 20) setHasMore(false);
      } catch (err) {
        console.error('Ошибка рекомендаций:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [isAuth]);

  const loadMore = async () => {
    setLoading(true);
    const nextTopN = topN + 20;
    
    try {
      const res = await apiService.getPersonal(nextTopN);
      const allItems = res.data.items || [];
      
      const existingIds = new Set(personalRecs.map(m => m.id || m.movie_id));
      const newItems = allItems.filter((item: any) => !existingIds.has(item.id || item.movie_id));

      if (newItems.length > 0) {
        const enrichedNew = await Promise.all(
          newItems.map(async (item: any) => {
            try { return (await apiService.getMovie(item.movie_id || item.id)).data; } 
            catch { return item; }
          })
        );
        setPersonalRecs(prev => [...prev, ...enrichedNew]);
      }

      setTopN(nextTopN);
      if (allItems.length < nextTopN) setHasMore(false);
      
    } catch (err) {
      console.error('Ошибка загрузки рекомендаций:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return (
      <div className="max-w-2xl mx-auto p-10 mt-10 text-center bg-slate-800 rounded-3xl border border-slate-700 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">Рекомендации для вас</h2>
        <p className="text-slate-400 text-lg mb-8">
          Чтобы мы могли подобрать фильмы специально под ваш вкус, пожалуйста, войдите в свой аккаунт или зарегистрируйтесь.
        </p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full text-white font-bold transition shadow-lg inline-block">
          Войти в аккаунт
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {personalRecs.length === 0 && loading ? (
        <div className="flex justify-center items-center h-64">
          <h2 className="text-2xl md:text-xl font-bold text-slate-400 animate-pulse text-center">
            Подбираем лучшие фильмы для вас...
          </h2>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-8">Специально для вас</h1>
          
          {personalRecs.length === 0 ? (
            <div className="text-slate-400 text-lg text-center mt-10">
              Оцените несколько фильмов, чтобы мы могли составить для вас подборку!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {personalRecs.map(movie => (
                <MovieCard key={movie.id || movie.movie_id} movie={movie} />
              ))}
            </div>
          )}

          {hasMore && personalRecs.length > 0 && (
            <div className="flex justify-center mt-12 mb-8">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-10 rounded-full transition shadow-lg"
              >
                {loading ? 'Загрузка...' : ' Загрузить еще'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};