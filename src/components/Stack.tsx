import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { setSelectedFromReg } from "../store/slices/uiSlice";
import { push, pop } from "../store/slices/stackSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { registersSlice } from "../store/slices/registersSlice";

export const Stack: React.FC = () => {
	const dispatch = useAppDispatch();
	const stack = useAppSelector((state) => state.stack);
	const registers = useAppSelector((state) => state.registers);
	const selectedReg = useAppSelector((state) => state.ui.selectedFromReg);

	const handleRegisterSelect = (value: string) => {
		dispatch(setSelectedFromReg(value));
	};

	const handlePush = () => {
		const registerValue =
			registers[selectedReg.toLowerCase() as keyof typeof registers].value;
		dispatch(push(registerValue));
		dispatch(
			addOperation({
				operation: "PUSH",
				register: selectedReg,
				value: registerValue,
				type: "STACK",
			}),
		);
	};

	const handlePop = () => {
		if (stack.values.length > 0) {
			const topValue = stack.values[0];
			dispatch(
				registersSlice.actions.updateRegister({
					register: selectedReg.toLowerCase() as keyof typeof registers,
					value: topValue,
				}),
			);
			dispatch(pop());
			dispatch(
				addOperation({
					operation: "POP",
					register: selectedReg,
					value: topValue,
					type: "STACK",
				}),
			);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Stos</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Wybierz rejestr do operacji PUSH/POP:</Label>
						<Select value={selectedReg} onValueChange={handleRegisterSelect}>
							<SelectTrigger>
								<SelectValue placeholder="Wybierz rejestr" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="AX">AX</SelectItem>
								<SelectItem value="BX">BX</SelectItem>
								<SelectItem value="CX">CX</SelectItem>
								<SelectItem value="DX">DX</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-2">
						<Button
							onClick={handlePush}
							className="w-full"
							disabled={!selectedReg}
						>
							PUSH
						</Button>
						<Button
							onClick={handlePop}
							className="w-full"
							disabled={!selectedReg || stack.values.length === 0}
						>
							POP
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<span>SP: {stack.pointer}</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<HelpCircle className="h-4 w-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent className="max-w-[300px]">
									<div className="space-y-2">
										<p>
											<strong>SP (Stack Pointer)</strong> - wskaźnik stosu
											pokazujący aktualną pozycję na szczycie stosu.
										</p>
										<p>
											Wartość {stack.pointer} oznacza, że następna operacja PUSH
											zapisze dane pod tym adresem. SP zwiększa się o 2 przy
											każdej operacji POP i zmniejsza o 2 przy PUSH (każda
											wartość na stosie zajmuje 2 bajty).
										</p>
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className="h-32 overflow-y-auto border rounded p-2">
						{stack.values.map((value, index) => (
							<div key={`${index}-${value}`} className="text-sm font-mono">
								{stack.pointer - index * 2}: {value}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
