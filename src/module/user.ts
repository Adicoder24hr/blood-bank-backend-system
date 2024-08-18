import { compare, genSalt, hash } from "bcrypt";
import mongoose, { Document } from "mongoose";


interface userDocument extends Document {
    username: string;
    password: string;
    email: string;
    bloodGroup: string;
    isValidPassword: (password: string) => Promise<boolean>;
}

const user = new mongoose.Schema({
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
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    }
});

user.pre<userDocument>('save', async function(next){
    if(this.isModified('password')){
        const salt = await genSalt(10)
        this.password = await hash(this.password, salt);

        next();
    }
});

user.methods.isValidPassword = async function(EnteredPassword: string): Promise<boolean>{
    return await compare(EnteredPassword, this.password);
}

export default mongoose.model<userDocument>("users", user);