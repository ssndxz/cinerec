import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { User, Mail, LogOut, CheckCircle, Bookmark } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

export const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await apiService.getMe();
        setUserData(userRes.data);

        const watchRes = await apiService.getMyWatchlist();
        const items = watchRes.data || [];
        
        const fullMovies = await Promise.all(
          items.map(async (item: any) => {
            try { 
              return (await apiService.getMovie(item.movie_id || item.id)).data; 
            } catch { 
              return item; 
            }
          })
        );
        
        setWatchlist(fullMovies.reverse()); 

      } catch (err) {
        console.error("Ошибка загрузки данных профиля", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = import.meta.env.BASE_URL; 
  };

  if (loading) return <div className="text-center mt-20 text-slate-400">Загрузка профиля...</div>;
  if (!userData) return <div className="text-center mt-20 text-red-400">Пожалуйста, войдите в систему.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      
      <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-10 border border-slate-700 mb-16 max-w-3xl mx-auto">
        <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-600 shadow-inner shrink-0">
          <User size={64} className="text-slate-400" />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start w-full">
          <h2 className="text-4xl font-bold text-white mb-2">{userData.username}</h2>
          
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-lg">
            <Mail size={20} />
            <span>{userData.email}</span>
          </div>

          <div className="flex gap-4 mb-10 text-sm bg-slate-900/50 py-3 px-6 rounded-xl border border-slate-700/50 justify-center md:justify-start">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle size={16} /> Активный аккаунт
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-8 py-3 rounded-xl font-bold transition w-full md:w-auto">
            <LogOut size={20} />
            Выйти из системы
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 border-b border-slate-800 pb-4">
          <Bookmark className="text-blue-500" fill="currentColor" size={32} />
          Мой список
        </h2>

        {watchlist.length === 0 ? (
          <div className="text-center bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12">
            <p className="text-slate-400 text-lg mb-4">В вашем списке пока нет фильмов.</p>
            <p className="text-slate-500">Добавляйте фильмы в закладки, чтобы посмотреть их позже!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map(movie => (
              <MovieCard key={movie.id || movie.movie_id} movie={movie} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};