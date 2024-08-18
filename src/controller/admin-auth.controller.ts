import type { Request, Response } from "express";
import { createToken, verifyToken } from "../lib";
import admin from "../module/admin";
import type { JwtPayload } from "jsonwebtoken";

export const adminSignup = async ( req: Request, res: Response) =>{
    try{
        const body = req.body;

        if(!body.username || !body.password || !body.email){
            return res.status(404).send("Invalid Credentials!");
        }
        if(typeof body.username !== "string"){
            return res.status(404).send("Invalid username");
        }
        if(typeof body.password !== "string"){
            return res.status(404).send("Invalid password");
        }
        if(typeof body.email !== "string"){
            return res.status(404).send("Invalid email");
        }

        const Registered_admin = await admin.findOne({email: body.email});

        if(Registered_admin){
            return res.status(403).json({
                status: 403,
                message: "Email already registered"
            })
        }

        let adminData = {...body};

        await admin.create(adminData);

        res.cookie("token", createToken({username: body.username, email: body.email}), {
            path: "/admin",
            httpOnly: true,
            encode: btoa,
            expires: new Date(new Date().setDate(new Date().getDate() + 30 ))
        });
        return res.status(200).json({
            status: "200",
            message: "admin created successfully",
            data: adminData
        })
    }
    catch(e){
        return res.status(500).json({
            status: "500",
            message: "Internal server error"
        })
    }
}

export const adminLogin = async (req: Request, res: Response) => {
    try{
        const body = req.body;

        if(!body.username || !body.password || !body.email){
            return res.status(404).send("Invalid Credentials");
        }
        if(typeof body.username!== "string"){
            return res.status(404).send("Invalid username");
        }
        if(typeof body.password!== "string"){
            return res.status(404).send("Invalid password");
        }
        if(typeof body.email!== "string"){
            return res.status(404).send("Invalid email");
        }

        const adminData = await admin.findOne({email: body.email})

        if(!adminData){
            return res.status(404).json({
                status: "404",
                message: "User is not Registered!"
            });
        };

        const isValidPassword = await adminData.isValidPassword(body.password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: "401",
                message: "Invalid password"
            });
        }
        
        res.cookie("token", createToken({username: body.username, email: body.email}), {
            path: "/admin",
            httpOnly: true,
            encode: btoa,
            expires: new Date(new Date().setDate(new Date().getDate() + 30 ))
        });

        return res.status(200).json({
            status: "200",
            message: "Admin logged in successfully",
            data: adminData.toJSON()
        })

    }
    catch(e){
        return res.status(500).json({
            status: "500",
            message: "Internal server error"
        })
    }
}

export const adminLogout = async (req: Request, res: Response) => {
    try{
        res.clearCookie("token", { path: "/admin" });
        return res.status(200).json({
            status: "200",
            message: "Admin logged out successfully"
        })
    }
    catch(e){
        return res.status(500).json({
            status: "500",
            message: "Internal server error"
        })
    }
}

export const refreshToken = async (req: Request , res: Response) => {
    try{

        res.cookie("token", createToken({username: (req.user as any).username as any, email: (req.user as any).email as any}), {
            path: "/admin",
            httpOnly: true,
            encode: btoa,
            expires: new Date(new Date().setDate(new Date().getDate() + 30 ))
        });

        return res.status(200).json({
            status: "200",
            message: "Admin token refreshed successfully",
        });
    }
    catch(e){
        return res.status(500).json({
            status: "500",
            message: "Internal server error"
        })
    }
}