const express = require("express");
const { getExpense, addExpense, deleteExpense } = require("../controller/Expense");
const router = express.Router();

// This will now handle the filtered request
router.get('/', getExpense); 
router.post('/exp', addExpense);
router.delete('/:id', deleteExpense);

module.exports = router;