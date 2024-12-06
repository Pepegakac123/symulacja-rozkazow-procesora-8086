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
	operation: string; // np. MOV, XCHG
	register?: string; // np. AX, BX
	secondRegister?: string; // dla XCHG
	value?: string; // wartość hex
	pointer?: string; // dla operacji pamięciowych
	type: string; // RANDOM, PRZYPISZ, XCHG, MOV, itp.
	timestamp: number;
}
export interface MemoryCell {
	address: number;
	value: string;
	calculation?: {
		addressCalculation: string;
		valueSource: string;
	};
}
export interface Memory {
	cells: string[];
	displayedCells: MemoryCell[];
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
