import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.ts";

const initialState = {
    meeting_name: "",
    user_id:"",
    meetingCode:"",
    scheduledAt:null,
    duration:0,
    createdAt:null,
    status: "scheduled"
}

export const fetchMeeting = createAsyncThunk(
    "meeting-data",
    async () =>{
        const res= await api.get("users/meeting-data")
        return res.data
    }
)

const meetingSlice = createSlice({
    name: "meeting",
    initialState,
    reducers : {
        setMeeting: (state, action) => {
            return {...state, ...action.payload};
        },
        clearMeeting: () => initialState,
    },
    extraReducers : (builder) => {
        builder.addCase(fetchMeeting.fulfilled, (state, action) => {
            return {...state, ...action.payload};
        });
    },
})

export const { setMeeting, clearMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;