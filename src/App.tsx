import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { Recommendations } from './pages/Recommendations';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuth = !!localStorage.getItem('access_token');

  const closeMenu = () => setIsOpen(false);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav className="flex justify-between items-center p-6 bg-slate-900 sticky top-0 z-50 shadow-md relative">
        
        <div className="flex gap-8 items-center">
          <Link to="/" onClick={closeMenu} className="text-2xl font-black text-blue-500">
            CINE<span className="text-white">REC</span>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-slate-300 hover:text-white font-medium transition">Catalog</Link>
            <Link to="/recommendations" className="text-slate-300 hover:text-white font-medium transition">Recommendations</Link>
            <Link to="/search" className="text-slate-300 hover:text-white font-medium transition">Search</Link>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4 items-center">
          {isAuth ? (
            <Link to="/profile" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-full text-white font-bold transition shadow-lg shadow-blue-500/30">
              <User size={18} />
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white font-medium transition">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-bold transition shadow-lg shadow-blue-600/30 text-white">
                Register
              </Link>
            </>
          )}
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg transition-colors outline-none"
          aria-label="Switch menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800 p-6 flex flex-col gap-4 shadow-2xl z-50 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
            <Link to="/" onClick={closeMenu} className="text-slate-300 hover:text-white font-medium text-lg py-2 border-b border-slate-800/50 transition">
              Catalog
            </Link>
            <Link to="/recommendations" onClick={closeMenu} className="text-slate-300 hover:text-white font-medium text-lg py-2 border-b border-slate-800/50 transition">
              Recommendations
            </Link>
            <Link to="/search" onClick={closeMenu} className="text-slate-300 hover:text-white font-medium text-lg py-2 border-b border-slate-800/50 transition">
              Search
            </Link>
            
            <div className="flex flex-col gap-3 pt-2">
              {isAuth ? (
                <Link to="/profile" onClick={closeMenu} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-white font-bold transition shadow-lg">
                  <User size={20} />
                  Profile
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="text-center text-slate-300 hover:text-white font-medium py-2 transition">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition shadow-lg text-white">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto pb-10 px-4 md:px-0">
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