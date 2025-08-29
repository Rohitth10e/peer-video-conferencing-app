import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    username:{type:String, required: true, unique: true},
    password:{type:String, required:true},
    company: { type: String, trim: true },
    job: { type: String, trim: true },
    location: { type: String, trim: true },
    token:{type:String}
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export { User };