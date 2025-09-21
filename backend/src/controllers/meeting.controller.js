import {randomUUID as uuid} from "crypto";
import {Meeting} from "../models/meeting.js";

export const createMeet = async(req, res)=>{
    try {
        const meet_id = uuid();
        if(!req.user) return res.status(400).send({error: 'User not found'});
        const { meeting_name, scheduledAt, duration} = req.body;

        if(!meeting_name || !scheduledAt || !duration) return res.status(400).send({error: 'Fill out required fields'});

        const meeting = new Meeting({
            user_id:req.user.email,
            meetingCode:meet_id,
            meeting_name,
            scheduledAt: new Date(scheduledAt),
            duration,
        })

        await meeting.save();

        return res.status(201).json({
            meetingCode: meet_id,
            meeting_name,
            scheduledAt: meeting.scheduledAt,
            duration: meeting.duration,
            status: meeting.status,
            user_id: req.user.email
        });
    } catch (e) {
        if(process.env.NODE_ENV === 'development'){
            console.error(e);
        }
        return res.status(500).json({error: "Something went wrong"});
    }
}


// v2 feature
// export const joinMeet = async(req, res)=>{
//
// }