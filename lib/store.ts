import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/user/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer types for the store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
