import { configureStore, Action } from "@reduxjs/toolkit";
import kakaoMapSlice from "./kakaoMapSlice";
import logger from "redux-logger";
import planSlice from "./planSlice";

const makeStore = () => {
  const store = configureStore({
    reducer: {
      kakaoMap: kakaoMapSlice.reducer,
      plan: planSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV === 'development'
  });

  return store;
};

const store = makeStore();

export default store;

export type RootState = ReturnType<typeof store.getState>;