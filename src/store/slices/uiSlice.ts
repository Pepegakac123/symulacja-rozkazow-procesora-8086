import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddressingMode, OperationDirection } from "@/types";

interface UIState {
	selectedFromReg: string;
	selectedToReg: string;
	addressingMode: AddressingMode;
	direction: OperationDirection;
}

const initialState: UIState = {
	selectedFromReg: "AX",
	selectedToReg: "BX",
	addressingMode: "indexing",
	direction: "toMemory",
};

export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		setSelectedFromReg: (state, action: PayloadAction<string>) => {
			state.selectedFromReg = action.payload;
		},
		setSelectedToReg: (state, action: PayloadAction<string>) => {
			state.selectedToReg = action.payload;
		},
		setAddressingMode: (state, action: PayloadAction<AddressingMode>) => {
			state.addressingMode = action.payload;
		},
		setDirection: (state, action: PayloadAction<OperationDirection>) => {
			state.direction = action.payload;
		},
	},
});

export const {
	setSelectedFromReg,
	setSelectedToReg,
	setAddressingMode,
	setDirection,
} = uiSlice.actions;
