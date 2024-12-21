// Stack.tsx
// Komponent reprezentujący stos procesora Intel 8086
// Umożliwia wykonywanie operacji PUSH (odkładanie na stos) i POP (zdejmowanie ze stosu)
// wartości z wybranych rejestrów
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
	// Pobieranie stanu z Redux Store
	const dispatch = useAppDispatch();
	const stack = useAppSelector((state) => state.stack); // Stan stosu (wartości i wskaźnik)
	const registers = useAppSelector((state) => state.registers); // Stan rejestrów
	const selectedReg = useAppSelector((state) => state.ui.selectedFromReg); // Aktualnie wybrany rejestr

	// Obsługa wyboru rejestru do operacji PUSH/POP
	const handleRegisterSelect = (value: string) => {
		dispatch(setSelectedFromReg(value));
	};

	// Funkcja obsługująca operację PUSH - odkłada wartość z wybranego rejestru na stos
	const handlePush = () => {
		const registerValue =
			registers[selectedReg.toLowerCase() as keyof typeof registers].value;
		dispatch(push(registerValue)); // Dodanie wartości na stos
		// Zapisanie operacji w historii
		dispatch(
			addOperation({
				operation: "PUSH",
				register: selectedReg,
				value: registerValue,
				type: "STACK",
			}),
		);
	};

	// Funkcja obsługująca operację POP - zdejmuje wartość ze stosu do wybranego rejestru
	const handlePop = () => {
		if (stack.values.length > 0) {
			const topValue = stack.values[0]; // Pobranie wartości ze szczytu stosu
			// Aktualizacja wartości w rejestrze
			dispatch(
				registersSlice.actions.updateRegister({
					register: selectedReg.toLowerCase() as keyof typeof registers,
					value: topValue,
				}),
			);
			dispatch(pop()); // Usunięcie wartości ze stosu
			// Zapisanie operacji w historii
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
					{/* Wybór rejestru do operacji PUSH/POP */}
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

					{/* Przyciski operacji PUSH i POP */}
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

					{/* Wyświetlanie aktualnej wartości wskaźnika stosu (SP) */}
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

					{/* Wyświetlanie zawartości stosu */}
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
