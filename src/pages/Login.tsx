import { useState } from 'react';
import { apiService } from '../services/apiService';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await apiService.login({ email, password });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      window.location.href = '/';
    } catch { alert('Ошибка входа! Проверьте данные.'); }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 mb-4 rounded bg-slate-700 border border-slate-600 outline-none focus:border-blue-500"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Пароль" required
          className="w-full p-3 mb-6 rounded bg-slate-700 border border-slate-600 outline-none focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition">Войти</button>
        <p className="text-center text-slate-400 text-sm mt-4">
          Нет аккаунта? <Link to="/register" className="text-blue-500 hover:underline">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
};