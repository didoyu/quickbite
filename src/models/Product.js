import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    category: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true,
        default: ''
        
    },
    price: {
        type: Number,
        required: true,
        
    },
    image:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String
    },
    location:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    }

},{ timestamps: true });

export default mongoose.model('Product', productSchema);