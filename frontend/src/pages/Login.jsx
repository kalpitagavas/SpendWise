import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../App';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('userId')) navigate('/dashboard');
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('userId', data.userId);
            if (data.token) localStorage.setItem('token', data.token);
            navigate('/dashboard'); 
        } catch (err) {
            alert(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 style={{ color: '#2d3436', marginBottom: '10px' }}>SpendWise</h1>
                <p style={{ color: '#636e72', marginBottom: '30px' }}>Welcome back!</p>

                <form onSubmit={handleLogin} className="auth-form">
                    <input 
                        className="auth-input"
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        className="auth-input"
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link style={{color: '#00b894', fontWeight: 'bold'}} to="/">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;