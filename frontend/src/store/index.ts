import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice.ts'
import meetingReducer from '../features/meeting/meetingSlice.ts'

export const store = configureStore({
    reducer: {
        user: userReducer,
        meeting: meetingReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;