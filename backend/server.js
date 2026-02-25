const express=require("express");
require('dotenv').config();
const cors=require('cors');
const connectDB = require("./config/db");
const ExpressRoute=require("./routes/ExpressRoute")
const authRoutes=require('./routes/UserRoute')
const app=express()
app.use(cors({
    origin: ["https://spend-wise-lovat.vercel.app", "http://localhost:5173"], // Added Vite's default local port
    credentials: true
}));
app.use(express.json())

connectDB();
app.get("/",(req,res)=>{
    res.send("API is running...");
    console.log("Hello World")
})

app.use('/api/expense',ExpressRoute);
app.use('/api/auth', authRoutes);
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})