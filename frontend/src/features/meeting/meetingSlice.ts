import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.ts";

// const initialState = {
//     meeting_name: "",
//     user_id:"",
//     meetingCode:"",
//     scheduledAt:null,
//     duration:0,
//     createdAt:null,
//     status: "scheduled"
// }

const initialState = {
    meetings: [],
    loading: false,
    error: null
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
            state.meetings.push(...action.payload)
        },
        clearMeeting: () => initialState,
    },
    extraReducers : (builder) => {
        builder
            .addCase(fetchMeeting.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload.meetingsData;; // store backend array
            })
            .addCase(fetchMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

    },
})

export const { setMeeting, clearMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;