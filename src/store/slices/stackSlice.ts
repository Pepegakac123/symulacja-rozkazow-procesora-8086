import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stack } from "../../types";

const initialState: Stack = {
	values: [],
	pointer: 65534, // Zaczynamy od góry stosu
};

export const stackSlice = createSlice({
	name: "stack",
	initialState,
	reducers: {
		push: (state, action: PayloadAction<string>) => {
			const registerValue = action.payload;
			state.values.unshift(registerValue);
			state.pointer -= 2; // Zmniejszamy SP przy PUSH
		},
		pop: (state) => {
			if (state.values.length > 0) {
				state.values.shift();
				state.pointer += 2; // Zwiększamy SP przy POP
			}
		},
		resetStack: () => initialState,
	},
});

export const { push, pop, resetStack } = stackSlice.actions;
