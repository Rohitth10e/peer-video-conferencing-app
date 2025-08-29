import {validateToken} from "../utils/jwt.js";

export const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message:"No token provided"});
    }

    const token = authHeader.split(' ')[1];
    const decoded = validateToken(token);

    if(!decoded){
        return res.status(401).json({message:"No token provided"});
    }

    req.user = decoded;
    next();
}