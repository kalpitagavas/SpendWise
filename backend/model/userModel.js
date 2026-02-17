const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Fixed typo from bycrypt

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'please give a name'] },
    email: { 
        type: String, 
        required: [true, 'Please add an email'], 
        unique: true, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'], 
        minlength: 6, 
        select: false 
    },
    createdAt: { type: Date, default: Date.now } // Removed () so it generates time on creation
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() needed when using an async function in Mongoose
});
module.exports = mongoose.model('User', userSchema);