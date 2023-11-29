import admin from "@/axios/instance/client";
import { loginType, userStateType } from "@/types/types";
import setCookie, { getCookie } from "@/utils/cookies";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: userStateType = {
  user: {
    _id: "",
    name: "",
    email: "",
    gstin: "",
    pan: "",
    account: {
      acc_no: "",
      bank: "",
      ifsc: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      pin: "",
      country: "",
    },
    contact: "",
  },
  created: false,
  isLoading: false,
  error: "",
};

export const userAsync = createAsyncThunk(
  "user/login",
  async (user: loginType, { rejectWithValue }) => {
    try {
      const { data } = await admin({
        url: "/user/login",
        method: "POST",
        data: JSON.stringify(user),
      });

      if (data.status === "true") return data;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
        error.message ||
        "An unknown error has been occured, Please try again later!"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetch",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await admin({
        url: `/user/${id}`,
        headers: {
          Authorization: getCookie(),
        },
      });

      if (data.status === "true") return data;
      else throw new Error(data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
        error.message ||
        "An unknown error has been occured, Please try again later!"
      );
    }
  }
);

const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCreated(state) {
      state.created = false
    }
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(userAsync.pending, (state) => {
      state.isLoading = true;
      state.created = false
      state.user = initialState.user;
      state.error = "";
    });
    builder.addCase(userAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.created = true

      setCookie(action.payload.token);
      localStorage.setItem("user", action.payload.user._id);
      state.user = action.payload.user;
      state.error = "";
    });
    builder.addCase(userAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.created = false
      state.error = action.payload;
    });

    // fetch
    builder.addCase(fetchUserById.pending, (state) => {
      state.isLoading = true;
      state.user = initialState.user;
      state.error = "";
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.isLoading = false;

      localStorage.setItem("user", action.payload.user._id);
      state.user = action.payload.user;
      state.error = "";
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setCreated } = userslice.actions
export default userslice.reducer;
