const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    // Changed 'name' to 'user' for clarity
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive amount'],
        min: [0, 'Amount must be positive'] // Validation to prevent negative numbers
    },
    // Useful for Dashboard logic: Income vs Expense
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense'],
        default: 'expense'
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        // Added 'Income' and 'Salary' to the enum
        enum: ['Food', 'Shopping', 'Transport', 'Rent', 'Entertainment', 'Salary', 'Investment', 'Other']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now
    }
}, { 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('Expense', ExpenseSchema);