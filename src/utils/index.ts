import type { RegisterState, Register } from "@/types/";

export const isValidHex = (value: string): boolean =>
	/^[0-9A-Fa-f]{4}$/.test(value);

export const executeMove = (
	registers: RegisterState,
	sourceReg: Register,
	destReg: Register | undefined,
	inputValue: string | undefined,
): RegisterState => {
	const newRegisters = { ...registers };

	if (inputValue && isValidHex(inputValue)) {
		newRegisters[sourceReg] = inputValue;
	}
	return newRegisters;
};

export const executeExchange = (
	registers: RegisterState,
	sourceReg: Register,
	destReg: Register,
): RegisterState => {
	const newRegisters = { ...registers };
	const tempValue = registers[sourceReg];
	newRegisters[sourceReg] = registers[destReg];
	newRegisters[destReg] = tempValue;
	return newRegisters;
};

export const INITIAL_REGISTER_STATE: RegisterState = {
	AX: "0000",
	BX: "0000",
	CX: "0000",
	DX: "0000",
};
