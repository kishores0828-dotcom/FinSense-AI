import { useEffect, useState } from 'react';
import api from './api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  // Date state required for the updated database schema
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('monthly');
  const [editingId, setEditingId] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (viewMode === 'monthly') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      } else {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return tDate >= startOfWeek;
      }
    });
  };

  const filteredData = getFilteredTransactions();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      description, 
      amount: parseFloat(amount), 
      category: category || "General", 
      date 
    };

    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post('/transactions/', payload);
      }
      setEditingId(null);
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchTransactions();
    } catch (error) {
      alert("Operation failed. Please verify you are logged in.");
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setDescription(t.description);
    setAmount(Math.abs(t.amount));
    setCategory(t.category);
    setDate(t.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">FinSense <span className="text-blue-500">AI</span></h1>
          <button 
            onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 px-5 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Form Card */}
          <div className="lg:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
            <h2 className="text-xs font-bold mb-6 text-slate-500 uppercase tracking-widest">
              {editingId ? "Update Transaction" : "New Transaction"}
            </h2>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none" required />
              <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none" required />
              <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:ring-1 focus:ring-blue-500 outline-none text-white" required />
              
              <button className={`md:col-span-2 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg ${editingId ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}>
                {editingId ? "Save Changes" : "Add Transaction"}
              </button>
            </form>
          </div>

          {/* Totals Card */}
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-center text-center">
            <div className="flex bg-slate-950 p-1 rounded-2xl mb-8 border border-slate-800">
              <button onClick={() => setViewMode('monthly')} className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${viewMode === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'}`}>MONTHLY</button>
              <button onClick={() => setViewMode('weekly')} className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'}`}>WEEKLY</button>
            </div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Total Expenses</h2>
            <p className="text-5xl font-black text-white">
              ₹{filteredData.reduce((s,t) => s + Math.abs(t.amount), 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* History Section */}
        <h2 className="text-2xl font-bold mb-8 text-slate-200">Expenses History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map((t) => (
            <div key={t.id} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all flex flex-col h-44 relative group">
              
              {/* Top Row: Category & Date */}
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-lg border border-blue-500/20 tracking-wider">
                  {t.category || "General"}
                </span>
                <span className="text-[10px] text-slate-600 font-mono font-bold">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-slate-300 font-semibold truncate pr-6 text-base mb-1">{t.description}</h3>
                <p className="text-3xl font-black text-white">
                  ₹{Math.abs(t.amount).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Action Buttons - Fixed at Bottom Right */}
              <div className="absolute bottom-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={() => startEdit(t)} 
                  className="text-slate-500 hover:text-blue-400 p-1"
                  title="Edit"
                >
                  <span className="text-base">✎</span>
                </button>
                <button 
                  onClick={() => { if(window.confirm("Delete entry?")) api.delete(`/transactions/${t.id}`).then(fetchTransactions); }} 
                  className="text-slate-500 hover:text-red-400 p-1"
                  title="Delete"
                >
                  <span className="text-base">🗑</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;