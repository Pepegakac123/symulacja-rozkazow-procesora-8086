/**
 * Komponent Registers - reprezentuje główne rejestry procesora Intel 8086
 * Implementuje funkcjonalności:
 * - Wyświetlanie aktualnych wartości rejestrów (AX, BX, CX, DX)
 * - Operacje MOV (przenoszenie wartości) między rejestrami
 * - Operacje XCHG (zamiana wartości) między rejestrami
 * - Generowanie losowych wartości dla rejestrów
 * - Reset wartości rejestrów do stanu początkowego
 */
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
import RegisterAssignmentDialog from "./RegisterAssignmentDialog";
import {
	generateRandomValues,
	registersSlice,
} from "../store/slices/registersSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { setSelectedFromReg, setSelectedToReg } from "../store/slices/uiSlice";

export const Registers: React.FC = () => {
	// Hook Redux do wysyłania akcji
	const dispatch = useAppDispatch();

	// Pobieranie aktualnego stanu z Redux Store
	// Stan rejestrów (wartości AX, BX, CX, DX)
	const registers = useAppSelector((state) => state.registers);
	// Aktualnie wybrane rejestry do operacji (źródłowy i docelowy)
	const selectedFromReg = useAppSelector((state) => state.ui.selectedFromReg);
	const selectedToReg = useAppSelector((state) => state.ui.selectedToReg);

	/**
	 * Sprawdzenie czy wszystkie rejestry mają poprawny format
	 * (4 znaki w systemie szesnastkowym)
	 */
	const areAllValuesValid = useMemo(() => {
		return Object.values(registers).every(({ value }) => value.length === 4);
	}, [registers]);

	/**
	 * Obsługa generowania losowych wartości dla wszystkich rejestrów
	 * Każda wartość to 4-cyfrowa liczba szesnastkowa
	 */
	const handleRandom = () => {
		const randomValues = generateRandomValues();
		// Aktualizacja wartości w store
		dispatch(registersSlice.actions.setRandomValues(randomValues));

		// Dodanie informacji o każdej zmianie do historii operacji
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

	/**
	 * Resetowanie wszystkich rejestrów do wartości początkowej "0000"
	 */
	const handleReset = () => {
		dispatch(registersSlice.actions.resetRegisters());
		// Dodanie informacji o resecie każdego rejestru do historii
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

	/**
	 * Obsługa operacji MOV - przenosi wartość z rejestru źródłowego do docelowego
	 * Przykład: MOV AX, BX (przenosi wartość z BX do AX)
	 */
	const handleMOV = () => {
		if (!areAllValuesValid) return;

		const fromReg = selectedFromReg.toLowerCase() as keyof typeof registers;
		const toReg = selectedToReg.toLowerCase() as keyof typeof registers;

		// Wykonanie operacji MOV
		dispatch(
			registersSlice.actions.movRegisterToRegister({
				from: fromReg,
				to: toReg,
			}),
		);

		// Zapisanie operacji w historii
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

	/**
	 * Obsługa operacji XCHG - zamienia wartości między dwoma rejestrami
	 * Przykład: XCHG AX, BX (zamienia wartości między AX i BX)
	 */
	const handleXCHG = () => {
		if (!areAllValuesValid) return;

		// Wykonanie operacji XCHG
		dispatch(
			registersSlice.actions.xchgRegisters({
				first: selectedFromReg.toLowerCase() as keyof typeof registers,
				second: selectedToReg.toLowerCase() as keyof typeof registers,
			}),
		);

		// Zapisanie operacji w historii
		dispatch(
			addOperation({
				operation: "XCHG",
				register: selectedToReg,
				secondRegister: selectedFromReg,
				type: "XCHG",
			}),
		);
	};

	/**
	 * Obsługa zmiany rejestru źródłowego w interfejsie
	 * Zapewnia, że nie można wybrać tego samego rejestru jako źródłowy i docelowy
	 */
	const handleFromRegChange = (value: string) => {
		dispatch(setSelectedFromReg(value));
		// Jeśli wybrano ten sam rejestr co docelowy, zmień wybór rejestru docelowego
		if (value === selectedToReg) {
			const otherRegs = Object.values(registers)
				.map((reg) => reg.label)
				.filter((label) => label !== value);
			if (otherRegs.length > 0) {
				dispatch(setSelectedToReg(otherRegs[0]));
			}
		}
	};

	/**
	 * Obsługa zmiany rejestru docelowego w interfejsie
	 * Zapewnia, że nie można wybrać tego samego rejestru jako źródłowy i docelowy
	 */
	const handleToRegChange = (value: string) => {
		dispatch(setSelectedToReg(value));
		// Jeśli wybrano ten sam rejestr co źródłowy, zmień wybór rejestru źródłowego
		if (value === selectedFromReg) {
			const otherRegs = Object.values(registers)
				.map((reg) => reg.label)
				.filter((label) => label !== value);
			if (otherRegs.length > 0) {
				dispatch(setSelectedFromReg(otherRegs[0]));
			}
		}
	};

	/**
	 * Pomocnicza funkcja formatująca etykietę rejestru
	 * Wyświetla nazwę rejestru wraz z jego aktualną wartością
	 * Przykład: "AX [1234]"
	 */
	const getRegisterLabel = (label: string) => {
		const reg = label.toLowerCase() as keyof typeof registers;
		return `${label} [${registers[reg].value}]`;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rejestry główne</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Wyświetlanie wszystkich rejestrów jako pola tylko do odczytu */}
				{Object.entries(registers).map(([reg, { value, label }]) => (
					<div key={reg} className="mb-4">
						<Label>{label}</Label>
						<Input value={value} readOnly className="font-mono bg-gray-50" />
					</div>
				))}

				<div className="space-y-2">
					{/* Dialog umożliwiający ręczne przypisanie wartości do rejestrów */}
					<RegisterAssignmentDialog />

					{/* Przyciski operacji globalnych */}
					<Button onClick={handleRandom} className="w-full">
						RANDOM
					</Button>
					<Button onClick={handleReset} className="w-full">
						RESET
					</Button>

					{/* Selektory rejestrów do operacji MOV/XCHG */}
					<div className="flex gap-2">
						{/* Selektor rejestru źródłowego */}
						<Select value={selectedFromReg} onValueChange={handleFromRegChange}>
							<SelectTrigger className="font-mono">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(registers).map(({ label }) => (
									<SelectItem key={label} value={label} className="font-mono">
										{getRegisterLabel(label)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Selektor rejestru docelowego (bez możliwości wyboru rejestru źródłowego) */}
						<Select value={selectedToReg} onValueChange={handleToRegChange}>
							<SelectTrigger className="font-mono">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(registers)
									.filter(({ label }) => label !== selectedFromReg)
									.map(({ label }) => (
										<SelectItem key={label} value={label} className="font-mono">
											{getRegisterLabel(label)}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Przyciski operacji na rejestrach */}
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
