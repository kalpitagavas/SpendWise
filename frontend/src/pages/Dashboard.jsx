import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
    const [expense, setExpense] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const fetchExpenses = async () => {
        if (!userId) return;
        try {
            const { data } = await API.get(`/expense?userId=${userId}`);
            setExpense(data.data || data || []);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!userId) navigate('/login');
        else fetchExpenses();
    }, [userId]);

    const chartData = useMemo(() => {
        const categories = {};
        expense.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + item.amount;
        });
        return Object.keys(categories).map(key => ({ name: key, value: categories[key] }));
    }, [expense]);

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

    const filteredExpenses = expense.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (exp) => {
        setEditingId(exp._id);
        setTitle(exp.title);
        setAmount(exp.amount);
        setCategory(exp.category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { title, amount: Number(amount), category, user: userId };
            if (editingId) {
                await API.put(`/expense/${editingId}`, payload);
                setEditingId(null);
            } else {
                await API.post('/expense/exp', payload);
            }
            setTitle(''); setAmount(''); fetchExpenses();
        } catch (err) { alert("Action failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this transaction?")) {
            try {
                await API.delete(`/expense/${id}`);
                fetchExpenses();
            } catch (err) { alert("Delete failed"); }
        }
    };

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };
    const total = expense.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">SpendWise</h1>
                    <button 
                        onClick={handleLogout} 
                        className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Summary Card & Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Spent</p>
                        <h2 className="text-4xl font-extrabold text-emerald-500 mt-1 mb-6">₹{total.toLocaleString()}</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {editingId ? "Edit Transaction" : "Add New Expense"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="What did you buy?" value={title} 
                                onChange={(e) => setTitle(e.target.value)} required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                            <input 
                                type="number" placeholder="How much?" value={amount} 
                                onChange={(e) => setAmount(e.target.value)} required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                            <select 
                                value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-white"
                            >
                                <option value="Food">Food</option>
                                <option value="Rent">Rent</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Transport">Transport</option>
                            </select>
                            <button 
                                type="submit" 
                                className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${editingId ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'}`}
                            >
                                {editingId ? "Update Transaction" : "Save Expense"}
                            </button>
                            {editingId && (
                                <button 
                                    onClick={() => {setEditingId(null); setTitle(''); setAmount('');}}
                                    className="w-full text-gray-400 text-sm hover:underline"
                                >
                                    Cancel Editing
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Search and List Section */}
                <div className="space-y-6">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search your transactions..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-lg font-bold text-gray-700">History</h3>
                        <span className="text-sm text-gray-400">{filteredExpenses.length} Items</span>
                    </div>

                    <div className="grid gap-3">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400 animate-pulse">Loading data...</div>
                        ) : filteredExpenses.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400">
                                No transactions found matching your search.
                            </div>
                        ) : (
                            filteredExpenses.map((exp) => (
                                <div key={exp._id} className="flex justify-between items-center p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group border border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl">
                                            {exp.category === 'Food' ? '🍔' : exp.category === 'Rent' ? '🏠' : exp.category === 'Shopping' ? '🛍️' : '🚗'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{exp.title}</p>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                                                {exp.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="text-lg font-black text-gray-900">-₹{exp.amount.toLocaleString()}</p>
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(exp)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg">✎</button>
                                            <button onClick={() => handleDelete(exp._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">🗑</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;