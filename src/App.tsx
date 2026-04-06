import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Recommendations } from './pages/Recommendations';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';


function App() {
  const isAuth = !!localStorage.getItem('access_token');

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav className="flex justify-between items-center p-6 bg-slate-900 sticky top-0 z-50 shadow-md">
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-2xl font-black text-blue-500">
            CINE<span className="text-white">REC</span>
          </Link>

          <Link to="/" className="text-slate-300 hover:text-white font-medium transition">Каталог</Link>
          <Link to="/recommendations" className="text-slate-300 hover:text-white font-medium transition">Рекомендации</Link>
          <Link to="/search" className="text-slate-300 hover:text-white font-medium transition">Поиск</Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {isAuth ? (
            <Link to="/profile" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-full text-white font-bold transition shadow-lg shadow-blue-500/30">
              <User size={18} />
              Профиль
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white font-medium transition">Вход</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-bold transition shadow-lg shadow-blue-600/30">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container mx-auto pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;