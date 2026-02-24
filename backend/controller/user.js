const User = require("../model/userModel");
const bcrypt = require("bcryptjs"); // Fixed spelling
const jwt = require("jsonwebtoken"); // Added for token generation

const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: user._id
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: "Email already exists" });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user and explicitly get password
        const user = await User.findOne({ email }).select('+password');
        
        // Use generic "Invalid credentials" for both cases
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // Send this to frontend!
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { register, login };