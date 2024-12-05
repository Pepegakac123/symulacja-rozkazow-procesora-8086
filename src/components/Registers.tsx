import type React from "react";
import { useMemo } from "react";
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
import {
	generateRandomValues,
	registersSlice,
} from "../store/slices/registersSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { setSelectedFromReg, setSelectedToReg } from "../store/slices/uiSlice";

export const Registers: React.FC = () => {
	const dispatch = useAppDispatch();
	const registers = useAppSelector((state) => state.registers);
	const selectedFromReg = useAppSelector((state) => state.ui.selectedFromReg);
	const selectedToReg = useAppSelector((state) => state.ui.selectedToReg);

	// Sprawdzanie poprawności wszystkich wartości
	const areAllValuesValid = useMemo(() => {
		return Object.values(registers).every(
			({ value }) => isValidHexValue(value) && value.length === 4,
		);
	}, [registers]);

	const handleRegisterChange = (
		register: keyof typeof registers,
		value: string,
	) => {
		if (isValidHexValue(value)) {
			dispatch(registersSlice.actions.updateRegister({ register, value }));
			dispatch(
				addOperation({
					operation: "MOV",
					register: register.toUpperCase(),
					value: value.toUpperCase(),
					type: "PRZYPISZ",
				}),
			);
		}
	};

	const handleRandom = () => {
		const randomValues = generateRandomValues();
		dispatch(registersSlice.actions.setRandomValues());

		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(randomValues).forEach(([reg, value]) => {
			dispatch(
				addOperation({
					operation: "MOV",
					register: reg.toUpperCase(),
					value: value,
					type: "RANDOM",
				}),
			);
		});
	};

	const handleReset = () => {
		dispatch(registersSlice.actions.resetRegisters());
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.keys(registers).forEach((reg) => {
			dispatch(
				addOperation({
					operation: "MOV",
					register: reg.toUpperCase(),
					value: "0000",
					type: "RESET",
				}),
			);
		});
	};

	const handleMOV = () => {
		if (!areAllValuesValid) return;

		const fromReg = selectedFromReg.toLowerCase() as keyof typeof registers;
		const toReg = selectedToReg.toLowerCase() as keyof typeof registers;

		dispatch(
			registersSlice.actions.movRegisterToRegister({
				from: fromReg,
				to: toReg,
			}),
		);

		dispatch(
			addOperation({
				operation: "MOV",
				register: selectedToReg,
				secondRegister: selectedFromReg,
				value: registers[fromReg].value,
				type: "MOV",
			}),
		);
	};

	const handleXCHG = () => {
		if (!areAllValuesValid) return;

		dispatch(
			registersSlice.actions.xchgRegisters({
				first: selectedFromReg.toLowerCase() as keyof typeof registers,
				second: selectedToReg.toLowerCase() as keyof typeof registers,
			}),
		);

		dispatch(
			addOperation({
				operation: "XCHG",
				register: selectedToReg,
				secondRegister: selectedFromReg,
				type: "XCHG",
			}),
		);
	};

	const handleFromRegChange = (value: string) => {
		dispatch(setSelectedFromReg(value));
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
