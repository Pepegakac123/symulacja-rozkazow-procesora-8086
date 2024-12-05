import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { isValidHexValue } from "../utils/validation";
import { registersSlice } from "../store/slices/registersSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { setSelectedFromReg, setSelectedToReg } from "../store/slices/uiSlice";

export const Registers: React.FC = () => {
	const dispatch = useAppDispatch();
	const registers = useAppSelector((state) => state.registers);
	const selectedFromReg = useAppSelector((state) => state.ui.selectedFromReg);
	const selectedToReg = useAppSelector((state) => state.ui.selectedToReg);

	const handleRegisterChange = (
		register: keyof typeof registers,
		value: string,
	) => {
		if (isValidHexValue(value)) {
			dispatch(registersSlice.actions.updateRegister({ register, value }));
			dispatch(
				addOperation(`MOV ${register.toUpperCase()}, ${value.toUpperCase()}`),
			);
		}
	};

	const handleRandom = () => {
		dispatch(registersSlice.actions.setRandomValues());
		dispatch(addOperation("RANDOM values generated"));
	};

	const handleReset = () => {
		dispatch(registersSlice.actions.resetRegisters());
		dispatch(addOperation("RESET registers"));
	};

	const handleMOV = () => {
		dispatch(
			registersSlice.actions.movRegisterToRegister({
				from: selectedFromReg.toLowerCase() as keyof typeof registers,
				to: selectedToReg.toLowerCase() as keyof typeof registers,
			}),
		);
		dispatch(addOperation(`MOV ${selectedToReg}, ${selectedFromReg}`));
	};

	const handleXCHG = () => {
		dispatch(
			registersSlice.actions.xchgRegisters({
				first: selectedFromReg.toLowerCase() as keyof typeof registers,
				second: selectedToReg.toLowerCase() as keyof typeof registers,
			}),
		);
		dispatch(addOperation(`XCHG ${selectedToReg}, ${selectedFromReg}`));
	};

	const handleFromRegChange = (value: string) => {
		dispatch(setSelectedFromReg(value));
		// If the newly selected 'from' register is the same as the 'to' register,
		// update the 'to' register to a different value
		if (value === selectedToReg) {
			const otherRegs = Object.values(registers)
				.map((reg) => reg.label)
				.filter((label) => label !== value);
			if (otherRegs.length > 0) {
				dispatch(setSelectedToReg(otherRegs[0]));
			}
		}
	};

	const handleToRegChange = (value: string) => {
		dispatch(setSelectedToReg(value));
		// If the newly selected 'to' register is the same as the 'from' register,
		// update the 'from' register to a different value
		if (value === selectedFromReg) {
			const otherRegs = Object.values(registers)
				.map((reg) => reg.label)
				.filter((label) => label !== value);
			if (otherRegs.length > 0) {
				dispatch(setSelectedFromReg(otherRegs[0]));
			}
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rejestry główne</CardTitle>
			</CardHeader>
			<CardContent>
				{Object.entries(registers).map(([reg, { value, label }]) => (
					<div key={reg} className="mb-4">
						<Label>{label}</Label>
						<Input
							value={value}
							onChange={(e) =>
								handleRegisterChange(
									reg as keyof typeof registers,
									e.target.value,
								)
							}
							className="font-mono"
							maxLength={4}
						/>
					</div>
				))}

				<div className="space-y-2">
					<Button onClick={handleRandom} className="w-full">
						RANDOM
					</Button>
					<Button onClick={handleReset} className="w-full">
						RESET
					</Button>

					<div className="flex gap-2">
						<Select value={selectedFromReg} onValueChange={handleFromRegChange}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(registers).map(({ label }) => (
									<SelectItem key={label} value={label}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={selectedToReg} onValueChange={handleToRegChange}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(registers)
									.filter(({ label }) => label !== selectedFromReg)
									.map(({ label }) => (
										<SelectItem key={label} value={label}>
											{label}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-2">
						<Button onClick={handleMOV} className="w-full">
							MOV
						</Button>
						<Button onClick={handleXCHG} className="w-full">
							XCHG
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
