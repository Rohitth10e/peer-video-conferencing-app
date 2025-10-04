import { Router } from "express";
import { login, register, updateProfile, getUser } from '../controllers/user.controller.js';
import {authMiddleware} from "../middleware/auth.js";
import {createMeet, getMeetings, joinMeet} from "../controllers/meeting.controller.js";

const router = Router();

router.post("/login", login)
router.post("/register", register)
router.get("/me", authMiddleware ,getUser)
router.put('/update-profile', authMiddleware ,updateProfile);
router.post("/create-meet", authMiddleware, createMeet);
router.post("/join-meet", authMiddleware, joinMeet);
router.get("/meeting-data", authMiddleware, getMeetings);

export default router