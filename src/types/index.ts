export interface Register {
	value: string;
	label: string;
}

export interface Registers {
	ax: Register;
	bx: Register;
	cx: Register;
	dx: Register;
}

export interface AddressRegisters {
	si: Register;
	di: Register;
	bp: Register;
	disp: Register;
}

export type AddressingMode = "indexing" | "base" | "index-base";
export type OperationDirection = "toMemory" | "fromMemory";

export interface Operation {
	id: string;
	command: string;
	timestamp: number;
}

export interface Memory {
	cells: string[];
	displayedCells: { address: number; value: string }[];
}

export interface Stack {
	values: string[];
	pointer: number;
}

export interface AppState {
	registers: Registers;
	addressRegisters: AddressRegisters;
	memory: Memory;
	stack: Stack;
	operations: Operation[];
	ui: {
		selectedFromReg: string;
		selectedToReg: string;
		addressingMode: AddressingMode;
		direction: OperationDirection;
	};
}
