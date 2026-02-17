const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
     const connection=await mongoose.connect(process.env.URL)
   console.log(`MongoDB Connected: ${connection.connection.host}`);
    }
    catch(err){
        console.log("Error in Connection with MongoDB ")
    process.exit(1);
    }
}
module.exports=connectDB