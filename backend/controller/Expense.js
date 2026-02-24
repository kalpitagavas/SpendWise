const Expense = require('../model/ExpenseModel');

// 1. GET EXPENSES (Standardized)
const getExpense = async (req, res) => {
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        // We use 'user' because that is what you sent in the Frontend payload
        const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 }); 
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// 2. ADD EXPENSE
const addExpense = async (req, res) => {
    try {
        const newExpense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: newExpense });
    } catch (err) {  
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. DELETE EXPENSE (Fixed Status Code)
const deleteExpense = async (req, res) => {
    try {
        const deleteExp = await Expense.findByIdAndDelete(req.params.id);
        if (!deleteExp) return res.status(404).json({ success: false, message: "Expense not found" });
        
        // Note: 200 is better for successful deletions than 201 (Created)
        res.status(200).json({ success: true, message: "Expense removed successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { addExpense, getExpense, deleteExpense };