import { compare, genSalt, hash } from "bcrypt";
import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

interface AdminDocument extends Document{
    username: string;
    password: string;
    email: string;
    isValidPassword: (password: string) => Promise<boolean>;
}

const admin = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v: string){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Please enter a valid email address"
        }
    }
});

admin.pre<AdminDocument>('save', async function(next){
    if(this.isModified('password')){
        const salt = await genSalt(10)
        this.password = await hash(this.password, salt);

        next();
    }
});

admin.methods.isValidPassword = async function(EnteredPassword: string): Promise<boolean>{
    return await compare(EnteredPassword, this.password);
}

export default mongoose.model<AdminDocument>('Admin', admin);