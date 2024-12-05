import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddressRegisters } from "../../types";

const initialState: AddressRegisters = {
	si: { value: "0000", label: "SI" },
	di: { value: "0000", label: "DI" },
	bp: { value: "0000", label: "BP" },
	disp: { value: "0000", label: "DISP" },
};

export const addressRegistersSlice = createSlice({
	name: "addressRegisters",
	initialState,
	reducers: {
		updateAddressRegister: (
			state,
			action: PayloadAction<{
				register: keyof AddressRegisters;
				value: string;
			}>,
		) => {
			const { register, value } = action.payload;
			state[register].value = value.toUpperCase();
		},
		resetAddressRegisters: () => initialState,
		setRandomAddressValues: (state) => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.keys(state).forEach((reg) => {
				state[reg as keyof AddressRegisters].value = Array(4)
					.fill(0)
					.map(() => Math.floor(Math.random() * 16).toString(16))
					.join("")
					.toUpperCase();
			});
		},
	},
});

export const {
	updateAddressRegister,
	resetAddressRegisters,
	setRandomAddressValues,
} = addressRegistersSlice.actions;
