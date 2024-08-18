import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const token = req.cookies.token;
        console.log(token);

        if(!token){
            return res.status(401).json({
                status: "401",
                message: "Unauthorized"
            })
        }

        const decodedToken = atob(token);
        console.log(decodedToken);
        const validToken = verifyToken(decodedToken);

        if(typeof validToken === "string" || typeof validToken === "boolean"){
            return res.status(401).json({
                status: 401,
                message: "Unauthorized"
            })
        };

        req.user = validToken;
        next();
    }
    catch(e){
        return res.status(500).json({
            status: "500",
            message: "Internal server error"
        })
    }
}