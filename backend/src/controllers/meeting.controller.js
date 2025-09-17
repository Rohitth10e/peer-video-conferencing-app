import {randomUUID as uuid} from "crypto";
import {Meeting} from "../models/meeting.js";

export const createMeet = async(req, res)=>{
    try {
        const meet_id = uuid();
        if(!req.user) return res.status(400).send({error: 'User not found'});
        const { meeting_name } = req.body;
        const meeting = new Meeting({
            user_id:req.user.email,
            meetingCode:meet_id,
            meeting_name
        })

        await meeting.save();

        return res.status(201).json({meeting: meet_id, meeting_name: meeting_name, user_id: req.user.email});
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