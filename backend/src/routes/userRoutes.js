import { Router } from "express";
import { login, register } from '../controllers/user.controller.js';
import {authMiddleware} from "../middleware/auth.js";

const router = Router();

router.post("/login", login)
router.post("/register", register)
router.put('/update-profile',authMiddleware,updateProfile);

export default router