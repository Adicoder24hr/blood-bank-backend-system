import { env } from "../helper";
import jwt from "jsonwebtoken"

export const createToken = (data: {
    username: string;
    email: string;
}) => jwt.sign(data, env.JWT_KEY || "", {
    expiresIn: "30days"
})

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_KEY ?? "")