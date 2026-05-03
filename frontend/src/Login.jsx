import { useState } from 'react';
import api from './api';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    // FastAPI OAuth2 strictly requires 'username' and 'password' keys
    formData.append('username', username); 
    formData.append('password', password);

    const response = await api.post('/token', formData);
    const token = response.data.access_token;
    
    localStorage.setItem('token', token);
    setToken(token); 
    
  } catch (error) {
    console.error("Login Error:", error.response?.data);
    alert("Invalid credentials. Please try again.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-96 border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          FinSense <span className="text-blue-400">AI</span>
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} // Added this
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} // Added this
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;