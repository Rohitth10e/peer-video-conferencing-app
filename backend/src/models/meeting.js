import mongoose ,{ Schema } from "mongoose";

const meetingSchema = new Schema({
    meeting_name: { type: String },
    user_id:{type:String},
    meetingCode:{type:String, required:true, unique:true},
    scheduledAt:{type:Date, required: true},
    duration:{type:Number, required:true, default:30},
    createdAt:{type:Date, default: Date.now},
    status: {
        type: String,
        enum: ["scheduled", "ongoing", "ended"],
        default: "scheduled",
    },
})

const Meeting = mongoose.model("Meeting", meetingSchema)

export { Meeting }