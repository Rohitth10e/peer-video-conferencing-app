import mongoose ,{ Schema } from "mongoose";

const meetingSchema = new Schema({
    meeting_name: { type: String },
    user_id:{type:String},
    meetingCode:{type:String, required:true},
    date:{type:Date, default: Date.now, required: true}
})

const Meeting = mongoose.model("Meeting", meetingSchema)

export { Meeting }