import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Memory } from "@/types";
const initialMemory: Memory = {
	cells: Array(65536).fill("00"),
	displayedCells: [],
};

export const memorySlice = createSlice({
	name: "memory",
	initialState: initialMemory,
	reducers: {
		writeToMemory: (
		  state,
		  action: PayloadAction<{
			address: number;
			value: string;
			calculation?: {
			  addressCalculation: string;
			  valueSource: string;
			};
		  }>,
		) => {
		  const { address, value, calculation } = action.payload;
		  state.cells[address] = value;
		  state.displayedCells = state.cells
			.map((value, index) => ({
			  address: index,
			  value,
			  calculation: index === address ? calculation : undefined,
			}))
			.filter((cell) => cell.value !== "00");
		},
		resetMemory: () => initialMemory,
	},
});
