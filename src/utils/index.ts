// utils/index.ts
import type { RegisterState, Register, MemoryState, MemoryAddressing } from "@/types/";

export const isValidHex = (value: string): boolean =>
  /^[0-9A-Fa-f]{4}$/.test(value);

export const calculateEffectiveAddress = (
  baseRegister: string,
  offset: string
): string => {
  const base = parseInt(baseRegister, 16);
  const offs = parseInt(offset, 16);
  const effectiveAddress = base + offs;
  return effectiveAddress.toString(16).toUpperCase().padStart(4, '0');
};

export const executeMove = (
  registers: RegisterState,
  sourceReg: Register,
  destReg: Register | undefined,
  inputValue: string | undefined,
  memory: MemoryState,
  memoryAddressing?: MemoryAddressing,
  isMemoryOperation: boolean = false
): { registers: RegisterState; memory: MemoryState } => {
  const newRegisters = { ...registers };
  const newMemory = { ...memory };

  if (isMemoryOperation && memoryAddressing) {
    const effectiveAddress = calculateEffectiveAddress(
      memoryAddressing.baseRegister,
      memoryAddressing.offset
    );

    if (destReg) {
      // MOV [BX + offset], Reg
      newMemory[effectiveAddress] = registers[sourceReg];
    } else {
      // MOV Reg, [BX + offset]
      newRegisters[sourceReg] = memory[effectiveAddress] || '0000';
    }
  } else if (inputValue && isValidHex(inputValue)) {
    // Standardowy MOV
    newRegisters[sourceReg] = inputValue;
  }

  return { registers: newRegisters, memory: newMemory };
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

export const INITIAL_MEMORY_STATE: MemoryState = {};