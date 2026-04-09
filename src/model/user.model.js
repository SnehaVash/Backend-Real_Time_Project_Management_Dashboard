import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {type: String, enum : ["admin", "member"], default: "member"},
    isActive: {type: boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

const user = mongoose.model('user', userSchema);

export default user;