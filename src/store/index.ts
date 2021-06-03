import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { diagramSlice, actions as diagramActions } from "./diagram";
import { globalOptionsSlice, actions as globalActions } from "./global";

export const store = configureStore({
  reducer: {
    globalOptions: globalOptionsSlice.reducer,
    diagram: diagramSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const actions = {
  ...diagramActions,
  ...globalActions,
};
