const mongoose=require("mongoose");

const ExpenseSchema=new mongoose.Schema({
    name:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    title:{type:String,required: [true, 'Please add a title'],trim:true},
    amount:{type:Number,required:[true,'Please add a positive amount']},
    category:{type:String,required: [true, 'Please select a category'],enum:['Food','Shopping','Transport','Rent','Entertainment']},
    createdAt:{type:Date,default: Date.now}
})
module.exports = mongoose.model('Expense', ExpenseSchema);