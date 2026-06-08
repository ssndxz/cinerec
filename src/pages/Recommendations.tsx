import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { MovieCard } from '../components/MovieCard';

export const Recommendations = () => {
  const isAuth = !!localStorage.getItem('access_token');
  const [personalRecs, setPersonalRecs] = useState<any[]>([]);
  const [topN, setTopN] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuth) return;

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await apiService.getPersonal(20);
        const rawItems = res.data.items || [];
        
        // Enrich raw items with detailed movie data to populate release year and global ratings
        const enrichedMovies = await Promise.all(
          rawItems.map(async (item: any) => {
            try {
              const detailsRes = await apiService.getMovie(item.movie_id || item.id);
              return detailsRes.data;
            } catch {
              return item; // Fallback to raw item if database lookup fails
            }
          })
        );

        setPersonalRecs(enrichedMovies);
        if (rawItems.length < 20) setHasMore(false);
      } catch (err) {
        console.error('Error fetching initial recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [isAuth]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const nextTopN = topN + 20;
    
    try {
      const res = await apiService.getPersonal(nextTopN);
      const allItems = res.data.items || [];
      
      // Filter out duplicate movies that are already rendered in state
      const existingIds = new Set(personalRecs.map(m => m.id || m.movie_id));
      const newItems = allItems.filter((item: any) => !existingIds.has(item.movie_id || item.id));

      if (newItems.length > 0) {
        // Enrich the batch of new recommendation entries
        const enrichedNew = await Promise.all(
          newItems.map(async (item: any) => {
            try {
              const detailsRes = await apiService.getMovie(item.movie_id || item.id);
              return detailsRes.data;
            } catch {
              return item;
            }
          })
        );
        setPersonalRecs(prev => [...prev, ...enrichedNew]);
      }

      setTopN(nextTopN);
      
      // Enforce the maximum bounds specified by the backend documentation (max 100 items)
      if (allItems.length < nextTopN || nextTopN >= 100) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading extended recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return (
      <div className="max-w-2xl mx-auto p-10 mt-10 text-center bg-slate-800 rounded-3xl border border-slate-700 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">Recommendations for You</h2>
        <p className="text-slate-400 text-lg mb-8">
          To help us recommend movies tailored to your taste, please sign in or create an account.
        </p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full text-white font-bold transition shadow-lg inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {personalRecs.length === 0 && loading ? (
        <div className="flex justify-center items-center h-64">
          <h2 className="text-2xl md:text-xl font-bold text-slate-400 animate-pulse text-center">
            Getting your recommendations ready...
          </h2>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-8">Recommendations for You</h1>
          
          {personalRecs.length === 0 ? (
            <div className="text-slate-400 text-lg text-center mt-10">
              Rate a few movies so we can create a personalized selection for you!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {personalRecs.map((movie, index) => (
                <MovieCard key={`${movie.id || movie.movie_id}-${index}`} movie={movie} />
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
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};