import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { isValidHexValue } from "../utils/validation";
import { updateAddressRegister } from "../store/slices/addressRegistersSlice";
import { setAddressingMode, setDirection } from "../store/slices/uiSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { memorySlice } from "../store/slices/memorySlice";
import { registersSlice } from "../store/slices/registersSlice";
import type { AddressingMode, AddressRegisters } from "../types";

export const Memory: React.FC = () => {
	const dispatch = useAppDispatch();
	const memory = useAppSelector((state) => state.memory);
	const registers = useAppSelector((state) => state.registers);
	const addressRegisters = useAppSelector((state) => state.addressRegisters);
	const addressingMode = useAppSelector((state) => state.ui.addressingMode);
	const direction = useAppSelector((state) => state.ui.direction);
	const selectedReg = useAppSelector((state) => state.ui.selectedFromReg);

	const handleAddressingModeChange = (mode: AddressingMode) => {
		dispatch(setAddressingMode(mode));
	};

	const handleDirectionChange = (dir: "toMemory" | "fromMemory") => {
		dispatch(setDirection(dir));
	};

	const handleRegisterChange = (
		register: keyof AddressRegisters,
		value: string,
	) => {
		if (isValidHexValue(value)) {
			dispatch(updateAddressRegister({ register, value }));
		}
	};

	const calculateEffectiveAddress = (): number => {
		let address = 0;
		const si = Number.parseInt(addressRegisters.si.value, 16);
		const di = Number.parseInt(addressRegisters.di.value, 16);
		const bp = Number.parseInt(addressRegisters.bp.value, 16);
		const disp = Number.parseInt(addressRegisters.disp.value, 16);

		switch (addressingMode) {
			case "indexing":
				address = si + disp;
				break;
			case "base":
				address = bp + disp;
				break;
			case "index-base":
				address = si + bp + disp;
				break;
		}

		return address & 0xffff;
	};

	const handleMOV = () => {
		const effectiveAddress = calculateEffectiveAddress();
		const selectedRegister =
			selectedReg.toLowerCase() as keyof typeof registers;

		if (direction === "toMemory") {
			const value = registers[selectedRegister].value;
			dispatch(
				memorySlice.actions.writeToMemory({
					address: effectiveAddress,
					value: value,
				}),
			);
			dispatch(addOperation(`MOV [${getAddressingString()}], ${selectedReg}`));
		} else {
			const value = memory.cells[effectiveAddress];
			dispatch(
				registersSlice.actions.writeFromMemory({
					register: selectedRegister,
					value: value,
				}),
			);
			dispatch(addOperation(`MOV ${selectedReg}, [${getAddressingString()}]`));
		}
	};

	const handleXCHG = () => {
		const effectiveAddress = calculateEffectiveAddress();
		const selectedRegister =
			selectedReg.toLowerCase() as keyof typeof registers;
		const regValue = registers[selectedRegister].value;
		const memValue = memory.cells[effectiveAddress];

		dispatch(
			memorySlice.actions.writeToMemory({
				address: effectiveAddress,
				value: regValue,
			}),
		);

		dispatch(
			registersSlice.actions.writeFromMemory({
				register: selectedRegister,
				value: memValue,
			}),
		);

		dispatch(addOperation(`XCHG ${selectedReg}, [${getAddressingString()}]`));
	};

	const getAddressingString = () => {
		const disp = addressRegisters.disp.value;
		switch (addressingMode) {
			case "indexing":
				return `SI+${disp}`;
			case "base":
				return `BP+${disp}`;
			case "index-base":
				return `SI+BP+${disp}`;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pamięć</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<Select value={direction} onValueChange={handleDirectionChange}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="toMemory">Do pamięci</SelectItem>
							<SelectItem value="fromMemory">Z pamięci</SelectItem>
						</SelectContent>
					</Select>

					<RadioGroup
						value={addressingMode}
						onValueChange={handleAddressingModeChange}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="indexing" id="indexing" />
							<Label htmlFor="indexing">Indeksowy</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="base" id="base" />
							<Label htmlFor="base">Bazowy</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="index-base" id="index-base" />
							<Label htmlFor="index-base">Indeksowo-bazowy</Label>
						</div>
					</RadioGroup>

					<div className="mt-4 space-y-2">
						{Object.entries(addressRegisters).map(([reg, { value, label }]) => (
							<div key={reg} className="mb-2">
								<Label>{label}</Label>
								<Input
									value={value}
									onChange={(e) =>
										handleRegisterChange(
											reg as keyof AddressRegisters,
											e.target.value,
										)
									}
									className="font-mono"
									maxLength={4}
								/>
							</div>
						))}
					</div>

					<div className="flex gap-2">
						<Button onClick={handleMOV} className="w-full">
							MOV
						</Button>
						<Button onClick={handleXCHG} className="w-full">
							XCHG
						</Button>
					</div>

					<div className="h-48 overflow-y-auto border rounded p-2">
						{memory.displayedCells.map(({ address, value }) => (
							<div key={address} className="text-sm font-mono">
								{address.toString(16).toUpperCase().padStart(4, "0")}: {value}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
