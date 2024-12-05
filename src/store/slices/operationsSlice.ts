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
		addOperation: (
			state,
			action: PayloadAction<Omit<Operation, "id" | "timestamp">>,
		) => {
			state.operations.unshift({
				id: uuidv4(),
				timestamp: Date.now(),
				...action.payload,
			});
		},
		clearOperations: () => initialState,
	},
});

export const { addOperation, clearOperations } = operationsSlice.actions;
