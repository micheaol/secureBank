import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export function createSecureBankStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
}
