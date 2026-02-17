import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../App';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('userId')) navigate('/dashboard');
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.post('/auth/register', formData);
            if (data.success || data.userId) {
                localStorage.setItem('userId', data.userId);
                alert("Account Created!");
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 style={{ color: '#2d3436', marginBottom: '10px' }}>SpendWise</h1>
                <p style={{ color: '#636e72', marginBottom: '30px' }}>Create your account</p>
                
                <form onSubmit={handleRegister} className="auth-form">
                    <input 
                        className="auth-input"
                        type="text" 
                        placeholder="Full Name" 
                        required 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                   <input 
                        className="auth-input"
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        // Fix: Make sure it's e.target.value
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                    <input 
                        className="auth-input"
                        type="password" 
                        placeholder="Password" 
                        required 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>
                
                <div className="auth-footer">
                    Already have an account? <Link style={{color: '#00b894', fontWeight: 'bold'}} to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;