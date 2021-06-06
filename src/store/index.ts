import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createLogger } from "redux-logger";
import { diagramSlice } from "./diagram";
import { globalOptionsSlice } from "./global";

export const store = configureStore({
  reducer: {
    globalOptions: globalOptionsSlice.reducer,
    diagram: diagramSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
    });

    if (import.meta.env.DEV) {
      const logger = createLogger({
        duration: true,
        collapsed: true,
      });
      middlewares.push(logger);
    }

    return middlewares;
  },

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
