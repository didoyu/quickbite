import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();

// Utility function to generate JWT token
const generateToken = (userId) => {
    // Ensure you have process.env.JWT_SECRET configured
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"})
}


router.post("/register", async (req, res )=>{
    try {
        // Destructure ALL fields from the request body
        const {firstName, lastName, phone, email, username, password} = req.body;

        // Validation for required fields
        if (!firstName || !lastName || !username || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        
        // Validation checks
        if (password.length < 6 || username.length < 6){
             return res.status(400).json({message: "Password and Username must be at least 6 characters long"})
        }

        // Check for existing user
        const existingEmail = await User.findOne({email});
        if (existingEmail){
            return res.status(400).json({message: "Email Address already taken"})
        }
        const existingUsername = await User.findOne({username});
        if (existingUsername){
            return res.status(400).json({message: "Username already taken"})
        }
        
        // Optional: Check phone uniqueness if provided
        if (phone) {
             const existingPhone = await User.findOne({ phone });
             if (existingPhone) {
                 return res.status(400).json({ message: "Phone number already associated with an account" });
             }
        }

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        // Create the new User document with all fields
        const user = new User({
            firstName,
            lastName,
            phone: phone || '', // Save phone, default to empty string if not provided
            username,
            email,
            password,
            profileImage,
        });

        await user.save();

        
        const token = generateToken(user._id);
        
        // Respond with token and complete user object
        res.status(201).json({
            token,
            user:{
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                // Do NOT include the password field in the response
            },
        });

    } catch (error){
        console.log("Error in register route", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

// The login route remains the same as provided previously
router.post("/login", async (req, res ) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) return res.status(400).json({message: "All fields are required"});

        const user = await User.findOne( { email });
        if(!user) return res.status(400).json({ message: "Invalid Credentials"});

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials"});

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });

    } catch  (error) {
        console.log("Error in login route", error);
        return res.status(500).json({message: "Internal server error"});
    }
});

export default router;