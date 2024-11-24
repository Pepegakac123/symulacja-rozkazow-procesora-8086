export type Operation = "MOV" | "XCHG";
export type Register = "AX" | "BX" | "CX" | "DX";
export type RegisterState = Record<Register, string>;

export type MemoryState = Record<string, string>;

export interface MemoryAddressing {
	baseRegister: string;
	offset: string;
}

export interface RegisterDisplayProps {
	registers: RegisterState;
}

export interface OperationSelectorProps {
	selectedOperation: Operation;
	onOperationChange: (operation: Operation) => void;
}

export interface RegisterSelectorProps {
	value: Register | "";
	onChange: (value: Register) => void;
	placeholder: string;
	disabled?: boolean;
}

export interface HexInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export interface ControlPanelProps {
	selectedOperation: Operation;
	sourceReg: Register | "";
	destReg: Register | "";
	inputValue: string;
	error: string;
	memoryAddressing?: MemoryAddressing; // Nowe pole
	isMemoryOperation: boolean; 
	onOperationChange: (operation: Operation) => void;
	onSourceRegChange: (reg: Register) => void;
	onDestRegChange: (reg: Register) => void;
	onInputChange: (value: string) => void;
	onMemoryAddressingChange: (addressing: MemoryAddressing) => void; // Nowa funkcja
	onToggleMemoryOperation: () => void;
	onExecute: () => void;
}
