import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { diagramSlice } from "./diagram";
import { globalOptionsSlice } from "./global";

//@ts-ignore
const logger = (s) => (next) => (action) => {
  console.log(action);
  next(action);
  console.log(s.getState());
};

export const store = configureStore({
  reducer: {
    globalOptions: globalOptionsSlice.reducer,
    diagram: diagramSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const actions = {
  ...diagramSlice.actions,
  ...globalOptionsSlice.actions,
};
