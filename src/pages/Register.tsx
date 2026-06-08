import { useState } from 'react';
import { apiService } from '../services/apiService';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiService.register({ email, username, password });
      alert('Successfully registered! Please log in.');
      navigate('/login');
    } catch (err: any) { alert(err.response?.data?.detail || 'Registration error!'); }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <form onSubmit={handleRegister} className="bg-slate-800 p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 mb-4 rounded bg-slate-700 border border-slate-600 outline-none"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="text" placeholder="Username" required
          className="w-full p-3 mb-4 rounded bg-slate-700 border border-slate-600 outline-none"
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full p-3 mb-6 rounded bg-slate-700 border border-slate-600 outline-none"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition">Register</button>
        <p className="text-center text-slate-400 text-sm mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};