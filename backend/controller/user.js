const User=require("../model/userModel")
const bycrypt=require("bcryptjs")
const register=async(req,res)=>{
    try{
     const user=await User.create(req.body)
     res.status(200).json({succes:true,message: "User registered successfully",
            userId: user._id})
    }
    catch(err){
        res.status(500).json({success:false,error: err.message})
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // You MUST add .select('+password') here!
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        // Compare password
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
module.exports = { register, login };