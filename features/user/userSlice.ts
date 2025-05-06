import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfileData } from "@/types/userType";

interface UserState {
  profile: UserProfileData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Function to get the initial profile from localStorage (safe check added)
function getInitialProfile(): UserProfileData | null {
  if (typeof window === "undefined") return null; // ⛔ SSR-safe

  try {
    const items = localStorage.getItem("User");
    if (!items) {
      console.log("User data not found in localStorage");
      return null;
    }
    return JSON.parse(items) as UserProfileData;
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
}

// Create an async thunk to fetch the user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async () => {
    return getInitialProfile(); // now SSR-safe
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: getInitialProfile(), // ✅ Now SSR-safe
    status: "idle",
    error: null,
  } as UserState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfileData>) => {
      state.profile = action.payload;
      state.status = "succeeded";
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? "loading" : "idle";
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = "failed";
    },
    clearUserProfile: (state) => {
      state.profile = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("User"); // ✅ SSR-safe clear
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user profile";
      });
  },
});

export const { setUserProfile, setLoading, setError, clearUserProfile } =
  userSlice.actions;

export default userSlice.reducer;
