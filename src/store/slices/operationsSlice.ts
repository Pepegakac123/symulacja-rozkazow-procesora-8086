import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Operation } from "../../types";

interface OperationsState {
	operations: Operation[];
}

const initialState: OperationsState = {
	operations: [],
};

export const operationsSlice = createSlice({
	name: "operations",
	initialState,
	reducers: {
		addOperation: (state, action: PayloadAction<string>) => {
			state.operations.unshift({
				id: uuidv4(),
				command: action.payload,
				timestamp: Date.now(),
			});
		},
		clearOperations: () => initialState,
	},
});

export const { addOperation, clearOperations } = operationsSlice.actions;
