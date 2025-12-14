import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // --- NEW FIELDS ADDED HERE ---
    firstName: {
        type: String,
        required: true, // Should match your frontend validation
        trim: true
    },
    lastName: {
        type: String,
        required: true, // Should match your frontend validation
        trim: true
    },
    phone: {
        type: String,
        required: false, // Make this optional if not strictly mandatory
        unique: true,
        sparse: true, // Allows null values, but unique index on non-null values
    },
    // --- END NEW FIELDS ---
    
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: "",
    },
    phone: { type: String, required: false, unique: true, sparse: true },
    birthdate: { type: String, default: '00-00-0000' }, // Store as string in MM-DD-YYYY format
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    civilStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'], default: 'Single' },
    nationality: { type: String, default: 'Filipino' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    province: { type: String, default: '' },
    profileImage: { type: String, default: "" },

},
    {timestamps: true}
);

// Pre-save hook for password hashing (remains the same)
userSchema.pre("save", async function (next){
    if(!this.isModified("password"))return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Method to compare password (remains the same)
userSchema.methods.comparePassword = async function (userPassword){
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;