import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{type:String,required:true},
    username:{type:String, required: true, unique: true},
    password:{type:String, required:true},
    token:{type:String}
})

const User = mongoose.Model("User", userSchema);

export { User };