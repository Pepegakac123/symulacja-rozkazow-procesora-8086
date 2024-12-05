import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Registers } from "@/types";

const generateRandomHex = () => {
	return Array(4)
		.fill(0)
		.map(() => Math.floor(Math.random() * 16).toString(16))
		.join("")
		.toUpperCase();
};

const initialRegisters: Registers = {
	ax: { value: "0000", label: "AX" },
	bx: { value: "0000", label: "BX" },
	cx: { value: "0000", label: "CX" },
	dx: { value: "0000", label: "DX" },
};

export const registersSlice = createSlice({
	name: "registers",
	initialState: initialRegisters,
	reducers: {
		updateRegister: (
			state,
			action: PayloadAction<{ register: keyof Registers; value: string }>,
		) => {
			const { register, value } = action.payload;
			state[register].value = value.toUpperCase();
		},
		resetRegisters: () => initialRegisters,
		setRandomValues: (state) => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.keys(state).forEach((reg) => {
				state[reg as keyof Registers].value = generateRandomHex();
			});
		},
		movRegisterToRegister: (
			state,
			action: PayloadAction<{ from: keyof Registers; to: keyof Registers }>,
		) => {
			const { from, to } = action.payload;
			state[to].value = state[from].value;
		},
		xchgRegisters: (
			state,
			action: PayloadAction<{
				first: keyof Registers;
				second: keyof Registers;
			}>,
		) => {
			const { first, second } = action.payload;
			const temp = state[first].value;
			state[first].value = state[second].value;
			state[second].value = temp;
		},
		writeFromMemory: (
			state,
			action: PayloadAction<{ register: keyof Registers; value: string }>,
		) => {
			const { register, value } = action.payload;
			state[register].value = value;
		},
	},
});

export const generateRandomValues = () => {
	return {
		ax: generateRandomHex(),
		bx: generateRandomHex(),
		cx: generateRandomHex(),
		dx: generateRandomHex(),
	};
};
