import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  const isAuth = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = import.meta.env.BASE_URL;
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav className="flex justify-between items-center p-6 bg-slate-900 sticky top-0 z-50 shadow-md">
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-2xl font-black text-blue-500">
            CINE<span className="text-white">REC</span>
          </Link>
          <Link to="/catalog" className="text-slate-300 hover:text-white font-medium">Каталог</Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {isAuth ? (
            <button onClick={handleLogout} className="text-slate-400 hover:text-white font-medium">
              Выйти
            </button>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white font-medium">Вход</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-bold transition">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container mx-auto pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;