import { compare, genSalt, hash } from "bcrypt";
import mongoose, { Document } from "mongoose";

interface superAdminDocument extends Document{
    username: string;
    password: string;
    email: string;
    isValidPassword: (password: string) => Promise<boolean>;
};

const superAdmin = new mongoose.Schema({
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
    },
});

superAdmin.pre<superAdminDocument>('save', async function(next){
    if(this.isModified('password')){
        const salt = await genSalt(10)
        this.password = await hash(this.password, salt);

        next();

    }
});

superAdmin.methods.isValidPassword = async function(enteredPassword: string): Promise<boolean>{
    return await compare(enteredPassword, this.password);
};

export default mongoose.model<superAdminDocument>("SuperAdmin", superAdmin);