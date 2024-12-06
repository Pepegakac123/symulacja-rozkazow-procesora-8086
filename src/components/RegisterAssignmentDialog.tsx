import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { registersSlice } from "../store/slices/registersSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { useToast } from "@/hooks/use-toast";
import { isValidHexValue } from "../utils/validation";

const RegisterAssignmentDialog = () => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const registers = useAppSelector((state) => state.registers);
	const [tempValues, setTempValues] = React.useState({
		ax: "",
		bx: "",
		cx: "",
		dx: "",
	});
	const [open, setOpen] = React.useState(false);

	const handleInputChange = (register: string, value: string) => {
		setTempValues((prev) => ({
			...prev,
			[register]: value,
		}));
	};

	const validateAndAssign = () => {
		let isValid = true;
		let hasChanges = false;

		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(tempValues).forEach(([register, value]) => {
			if (value !== "") {
				if (!isValidHexValue(value) || value.length !== 4) {
					toast({
						variant: "destructive",
						title: "Błąd walidacji",
						description: `Wartość dla rejestru ${register.toUpperCase()} musi być 4-cyfrową liczbą szesnastkową.`,
					});
					isValid = false;
				}
				hasChanges = true;
			}
		});

		if (!isValid) return;
		if (!hasChanges) {
			toast({
				variant: "destructive",
				title: "Brak zmian",
				description: "Nie wprowadzono żadnych nowych wartości.",
			});
			return;
		}

		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(tempValues).forEach(([register, value]) => {
			if (value !== "") {
				dispatch(
					registersSlice.actions.updateRegister({
						register: register as keyof typeof registers,
						value: value.toUpperCase(),
					}),
				);
				dispatch(
					addOperation({
						operation: "MOV",
						register: register.toUpperCase(),
						value: value.toUpperCase(),
						type: "PRZYPISZ",
					}),
				);
			}
		});

		setTempValues({
			ax: "",
			bx: "",
			cx: "",
			dx: "",
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full">PRZYPISZ</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Przypisz wartości do rejestrów</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{Object.entries(registers).map(([reg, { label }]) => (
						<div key={reg} className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor={reg} className="text-right">
								{label}
							</Label>
							<Input
								id={reg}
								value={tempValues[reg as keyof typeof tempValues]}
								onChange={(e) => handleInputChange(reg, e.target.value)}
								placeholder="0000"
								className="col-span-3 font-mono"
								maxLength={4}
							/>
						</div>
					))}
				</div>
				<Button onClick={validateAndAssign}>Przypisz wartości</Button>
			</DialogContent>
		</Dialog>
	);
};

export default RegisterAssignmentDialog;
