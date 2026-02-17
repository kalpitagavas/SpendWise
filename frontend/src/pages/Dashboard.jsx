import React, { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
    const [expense, setExpense] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");

    const userId = localStorage.getItem('userId');

   const fetchExpenses = async () => {
    try {
        // Send the userId from localStorage to the backend
        const { data } = await API.get(`/expense?userId=${userId}`); 
        setExpense(data.data || []); 
    } catch (err) {
        console.log("Error fetching data", err);
    }
};
    useEffect(() => {
        fetchExpenses();
    }, []);
const addExpense = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not found. Please log in again.");

    try {
        // Based on your error, the backend wants:
        // 1. 'title' as the name of the item (string)
        // 2. 'name' as the User ID (ObjectId)
        const payload = { 
            title: title,           // This satisfies "Please add a title"
            amount: Number(amount), 
            category: category,
            name: userId            // This satisfies the "ObjectId" requirement for the 'name' path
        };

        await API.post('/expense/exp', payload);
        
        setTitle(''); 
        setAmount(''); 
        fetchExpenses(); 
    } catch (err) {
        console.error("Add Expense Error:", err.response?.data);
        alert("Check console - Schema mismatch detected.");
    }
};
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                await API.delete(`/expense/${id}`);
                fetchExpenses();
            } catch (err) {
                alert("Error deleting expense");
            }
        }
    };

    const total = expense.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // --- Inline Styles ---
    const styles = {
        container: {
            maxWidth: '800px',
            margin: '40px auto',
            padding: '30px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        },
        header: {
            textAlign: 'center',
            color: '#2d3436',
            marginBottom: '30px'
        },
        card: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '30px',
            borderLeft: '5px solid #00b894',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        },
        form: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr auto',
            gap: '10px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '12px'
        },
        input: {
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #dfe6e9',
            fontSize: '1rem',
            outline: 'none'
        },
        button: {
            padding: '12px 20px',
            backgroundColor: '#00b894',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background 0.3s'
        },
        list: {
            listStyle: 'none',
            padding: 0
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '15px 20px',
            marginBottom: '10px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'transform 0.2s'
        },
        deleteBtn: {
            backgroundColor: '#ff7675',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
        },
        tag: {
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '20px',
            backgroundColor: '#e1f5fe',
            color: '#01579b',
            marginLeft: '10px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>SpendWise</h1>
                <p style={{ color: '#636e72' }}>Track your money, live better.</p>
            </header>

            <div style={styles.card}>
                <div style={{ fontSize: '0.9rem', color: '#636e72', textTransform: 'uppercase' }}>Total Balance</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00b894' }}>
                    ${total.toLocaleString()}
                </div>
            </div>

            <form onSubmit={addExpense} style={styles.form}>
                <input 
                    style={styles.input}
                    type="text" 
                    placeholder='Item Name (e.g. Groceries)' 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <input 
                    style={styles.input}
                    type="number" 
                    placeholder='Amount' 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                />
                <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Rent">Rent</option>
                    <option value="Transport">Transport</option>
                </select>
                <button type="submit" style={styles.button}>Add</button>
            </form>

            <h3 style={{ color: '#2d3436', marginBottom: '15px' }}>Recent History</h3>
            <ul style={styles.list}>
                {expense.length === 0 ? <p style={{textAlign: 'center', color: '#b2bec3'}}>No expenses yet.</p> : null}
                {expense.map((exp) => (
                    <li key={exp._id} style={styles.listItem} className="list-item">
                       <div>
                            <strong style={{ fontSize: '1.1rem' }}>{exp.title}</strong>
                            <span style={styles.tag}>{exp.category}</span>
                            <div style={{ fontSize: '0.8rem', color: '#b2bec3' }}>{new Date().toLocaleDateString()}</div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2d3436' }}>
                                -${exp.amount}
                            </span>
                            <button onClick={() => handleDelete(exp._id)} style={styles.deleteBtn}>Delete</button>
                       </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;