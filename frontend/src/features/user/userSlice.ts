import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {RootState} from "../../store";
import axios from "axios";
import api from "../../api/api.ts";

// define User type
type User = {
    name: string;
    email: string;
    username: string;
    company?: string;
    job?: string;
    location?: string;
}

// state type
type UserState = {
    data: User | null,
    status: "idle" | "loading" | "succeeded" | "failed",
}

// initial type
const initialState: UserState = {
    data: null,
    status:"idle",
}

// example async thunk (fetch user data)
export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, thunkAPI) => {
        try {
            const res = await api.get("/users/me"); // token added automatically
            return res.data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async (updatedData:Partial<User>, thunkAPI) => {
        try{
            const res = await api.put("/users/update-profile", updatedData);
            return res.data.data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
)



// create slice
const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        clearUser: (state) =>{
            state.data = null;
            state.status = "idle";
        },
    },
    extraReducers: (builder) =>{
        builder
            .addCase(fetchUser.pending, (state)=> {
                state.status = "loading";
            })
            .addCase(fetchUser.fulfilled, (state, action)=> {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state)=> {
                state.status = "failed";
            })
            .addCase(updateUser.pending, (state) => {
            state.status = "loading";
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload; // Update user data with the response
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = "failed";
            });
    }
})

export const {clearUser} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.data;

export default userSlice.reducer;