import { configureStore } from "@reduxjs/toolkit";
import { registersSlice } from "./slices/registersSlice";
import { memorySlice } from "./slices/memorySlice";
import { uiSlice } from "./slices/uiSlice";
import { addressRegistersSlice } from "./slices/addressRegistersSlice";
import { stackSlice } from "./slices/stackSlice";
import { operationsSlice } from "./slices/operationsSlice";

export const store = configureStore({
	reducer: {
		registers: registersSlice.reducer,
		memory: memorySlice.reducer,
		ui: uiSlice.reducer,
		addressRegisters: addressRegistersSlice.reducer,
		stack: stackSlice.reducer,
		operations: operationsSlice.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
