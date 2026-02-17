const express=require("express");
const Expense=require('../model/ExpenseModel')
const getExpense = async (req, res) => {
    const { userId } = req.query; // Catch the ID sent from frontend
    
    try {
        // We filter by 'name' because your Schema uses 'name' for the User ID
        const expenses = await Expense.find({ name: userId }); 
        res.status(200).json({ success: true, data: expenses });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const addExpense=async(req,res)=>{
    try{
     const newExpense=await Expense.create(req.body)
     res.status(201).json({success:true,data:newExpense})
    }
    catch(err){  
        res.status(500).json({success:false,error:err.message})

    }
}
const deleteExpense=async(req,res)=>{
    try{
     const deleteExp=await Expense.findByIdAndDelete(req.params.id)
     if(!deleteExp)return res.status(404).json({ message: "Not found" })
      res.status(201).json({success: true, message: "Expense removed"})
    }
    catch(err){
        res.status(500).json({success:false,error:err.message})
    }
}
module.exports={addExpense,getExpense,deleteExpense}
