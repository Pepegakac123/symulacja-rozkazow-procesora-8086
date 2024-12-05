import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stack } from "../../types";

const initialState: Stack = {
	values: [],
	pointer: 0,
};

export const stackSlice = createSlice({
	name: "stack",
	initialState,
	reducers: {
		push: (state, action: PayloadAction<string>) => {
			const registerValue = action.payload;
			// Push value to stack (2 bytes at a time)
			state.values.unshift(registerValue);
			state.pointer += 2;
		},
		pop: (state) => {
			if (state.values.length > 0) {
				state.values.shift();
				state.pointer -= 2;
			}
		},
		resetStack: () => initialState,
	},
});

export const { push, pop, resetStack } = stackSlice.actions;
