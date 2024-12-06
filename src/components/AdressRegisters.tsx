import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddressRegisterAssignmentDialog from "./AddressRegisterAssignmentDialog";
import {
	setRandomAddressValues,
	resetAddressRegisters,
	generateRandomAddressValues,
} from "../store/slices/addressRegistersSlice";
import { addOperation } from "../store/slices/operationsSlice";

export const AddressRegisters: React.FC = () => {
	const dispatch = useAppDispatch();
	const addressRegisters = useAppSelector((state) => state.addressRegisters);

	const handleRandom = () => {
		const randomValues = generateRandomAddressValues();
		dispatch(setRandomAddressValues(randomValues));

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
		dispatch(resetAddressRegisters());
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.keys(addressRegisters).forEach((reg) => {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rejestry adresowe</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Object.entries(addressRegisters).map(([reg, { value, label }]) => (
						<div key={reg} className="mb-4">
							<Label>{label}</Label>
							<Input value={value} readOnly className="font-mono bg-gray-50" />
						</div>
					))}

					<div className="flex flex-col gap-2">
						<AddressRegisterAssignmentDialog />

						<Button onClick={handleRandom} className="w-full">
							RANDOM
						</Button>
						<Button onClick={handleReset} className="w-full">
							RESET
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
