import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Register, Operation } from "@/types/";
import {
	executeExchange,
	executeMove,
	INITIAL_REGISTER_STATE,
	isValidHex,
} from "./utils";
import ControlPanel from "./components/ControlPanel";
import RegisterDisplay from "./components/registerDisplay";
const App: React.FC = () => {
	const [registers, setRegisters] = useState(INITIAL_REGISTER_STATE);
	const [selectedOperation, setSelectedOperation] = useState<Operation>("MOV");
	const [sourceReg, setSourceReg] = useState<Register | "">("");
	const [destReg, setDestReg] = useState<Register | "">("");
	const [inputValue, setInputValue] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleInputChange = (value: string): void => {
		const upperValue = value.toUpperCase();
		setInputValue(upperValue);
		if (value === "" || isValidHex(upperValue)) {
			setError("");
		} else {
			setError("Wprowadź poprawną 4-cyfrową wartość szesnastkową");
		}
	};

	const executeOperation = (): void => {
		if (!sourceReg) return;

		if (selectedOperation === "MOV") {
			setRegisters(
				executeMove(
					registers,
					sourceReg,
					destReg === "" ? undefined : destReg,
					inputValue,
				),
			);
		} else if (selectedOperation === "XCHG" && destReg) {
			setRegisters(executeExchange(registers, sourceReg, destReg));
		}

		setInputValue("");
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Symulator procesora 8086</CardTitle>
			</CardHeader>
			<CardContent>
				<RegisterDisplay registers={registers} />
				<ControlPanel
					selectedOperation={selectedOperation}
					sourceReg={sourceReg}
					destReg={destReg}
					inputValue={inputValue}
					error={error}
					onOperationChange={setSelectedOperation}
					onSourceRegChange={setSourceReg}
					onDestRegChange={setDestReg}
					onInputChange={handleInputChange}
					onExecute={executeOperation}
				/>
			</CardContent>
		</Card>
	);
};

export default App;
