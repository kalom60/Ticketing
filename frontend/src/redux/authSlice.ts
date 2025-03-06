import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../utils/axiosInstance";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (
    {
      userData,
      navigate,
    }: {
      userData: { email: string; password: string; role: string | undefined };
      navigate: NavigateFunction;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/auth/signup", userData);
      navigate("/");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message || "Invalid input");
          return rejectWithValue(error.response.data.message);
        } else if (error.response.status === 500) {
          toast.error("Something went wrong");
          return rejectWithValue("Something went wrong");
        }
      }
      return rejectWithValue("Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
        toast.success("Signup Successful");
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
