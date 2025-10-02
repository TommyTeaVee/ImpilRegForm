import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "./modelSlice";

const store = configureStore({
  reducer: {
    model: modelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // avoids errors when sending FormData
    }),
});

export default store;
