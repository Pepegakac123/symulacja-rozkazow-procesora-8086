import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	setDirection,
	setAddressingMode,
	setSelectedBaseReg,
	setSelectedFromReg,
} from "../store/slices/uiSlice";
import { memorySlice } from "../store/slices/memorySlice";
import { registersSlice } from "../store/slices/registersSlice";
import { addOperation } from "../store/slices/operationsSlice";
import type { AddressingMode } from "@/types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Komponent MemoryCell - wyświetla pojedynczą komórkę pamięci
 * wraz z szczegółami adresowania i źródłem wartości
 */
const MemoryCell: React.FC<{
	address: number;
	value: string;
	calculation?: {
		addressCalculation: string;
		valueSource: string;
	};
}> = ({ address, value, calculation }) => (
	<div className="text-sm font-mono flex items-center gap-2">
		<span>
			{/* Wyświetlanie adresu w formacie szesnastkowym i wartości */}
			{address.toString(16).toUpperCase().padStart(4, "0")}: {value}
		</span>
		{calculation && (
			<Tooltip>
				<TooltipTrigger>
					<HelpCircle className="h-4 w-4 text-muted-foreground" />
				</TooltipTrigger>
				<TooltipContent className="max-w-[300px]">
					<div className="space-y-2">
						<p>
							<strong>Adres:</strong> {calculation.addressCalculation}
						</p>
						<p>
							<strong>Wartość:</strong> {calculation.valueSource}
						</p>
					</div>
				</TooltipContent>
			</Tooltip>
		)}
	</div>
);

/**
 * Komponent MemoryOperations - implementuje operacje pamięciowe procesora Intel 8086
 * Obsługuje różne tryby adresowania:
 * - Indeksowy (SI/DI)
 * - Bazowy (BX/BP)
 * - Indeksowo-bazowy (kombinacje SI/DI + BX/BP)
 */
export const MemoryOperations: React.FC = () => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();

	// Pobieranie stanów z Redux store
	const memory = useAppSelector((state) => state.memory);
	const registers = useAppSelector((state) => state.registers);
	const addressRegisters = useAppSelector((state) => state.addressRegisters);
	const addressingMode = useAppSelector((state) => state.ui.addressingMode);
	const direction = useAppSelector((state) => state.ui.direction);
	const selectedReg = useAppSelector((state) => state.ui.selectedFromReg);
	const selectedBaseReg = useAppSelector((state) => state.ui.selectedBaseReg);

	/**
	 * Sprawdza poprawność wartości przesunięcia (DISP)
	 * @param disp - wartość przesunięcia w formacie szesnastkowym
	 */
	const isValidDisp = (disp: string): boolean => {
		return /^[0-9A-F]{4}$/.test(disp.toUpperCase());
	};

	/**
	 * Zwraca listę dostępnych rejestrów dla wybranego trybu adresowania
	 * Tryby:
	 * - indeksowy: SI, DI
	 * - bazowy: BX, BP
	 * - indeksowo-bazowy: kombinacje SI/DI + BX/BP
	 */
	const getAvailableRegisters = () => {
		switch (addressingMode) {
			case "indexing":
				return [
					{ value: "SI", label: "SI" },
					{ value: "DI", label: "DI" },
				];
			case "base":
				return [
					{ value: "BX", label: "BX" },
					{ value: "BP", label: "BP" },
				];
			case "index-base":
				return [
					{ value: "SI_BX", label: "SI+BX" },
					{ value: "SI_BP", label: "SI+BP" },
					{ value: "DI_BX", label: "DI+BX" },
					{ value: "DI_BP", label: "DI+BP" },
				];
			default:
				return [];
		}
	};

	/**
	 * Generuje tekstową reprezentację sposobu adresowania
	 * Przykłady:
	 * - Indeksowy: "SI+1234"
	 * - Bazowy: "BX+1234"
	 * - Indeksowo-bazowy: "SI+BX+1234"
	 */
	const getAddressingString = () => {
		const disp = addressRegisters.disp.value;
		switch (addressingMode) {
			case "indexing":
				return `${selectedBaseReg}+${disp}`;
			case "base":
				return `${selectedBaseReg}+${disp}`;
			case "index-base": {
				const [indexPart, basePart] = selectedBaseReg.split("_");
				return `${indexPart}+${basePart}+${disp}`;
			}
			default:
				return "";
		}
	};

	/**
	 * Oblicza efektywny adres pamięci na podstawie wybranego trybu adresowania
	 * Uwzględnia:
	 * - Wartości rejestrów indeksowych (SI/DI)
	 * - Wartości rejestrów bazowych (BX/BP)
	 * - Wartość przesunięcia (DISP)
	 *
	 * @returns obliczony adres pamięci lub -1 w przypadku błędu
	 */
	const calculateEffectiveAddress = (): number => {
		if (!isValidDisp(addressRegisters.disp.value)) {
			return -1;
		}

		const disp = Number.parseInt(addressRegisters.disp.value, 16);

		switch (addressingMode) {
			case "indexing": {
				const indexReg =
					selectedBaseReg === "SI"
						? Number.parseInt(addressRegisters.si.value, 16)
						: Number.parseInt(addressRegisters.di.value, 16);
				return (indexReg + disp) & 0xffff;
			}
			case "base": {
				const baseReg =
					selectedBaseReg === "BX"
						? Number.parseInt(registers.bx.value, 16)
						: Number.parseInt(addressRegisters.bp.value, 16);
				return (baseReg + disp) & 0xffff;
			}
			case "index-base": {
				const [indexPart, basePart] = selectedBaseReg.split("_");
				const indexReg =
					indexPart === "SI"
						? Number.parseInt(addressRegisters.si.value, 16)
						: Number.parseInt(addressRegisters.di.value, 16);
				const baseReg =
					basePart === "BX"
						? Number.parseInt(registers.bx.value, 16)
						: Number.parseInt(addressRegisters.bp.value, 16);
				return (indexReg + baseReg + disp) & 0xffff;
			}
			default:
				return -1;
		}
	};

	/**
	 * Obsługa operacji MOV między pamięcią a rejestrem
	 * Dwa kierunki:
	 * - Z rejestru do pamięci (toMemory)
	 * - Z pamięci do rejestru (fromMemory)
	 */
	const handleMOV = () => {
		const effectiveAddress = calculateEffectiveAddress();
		if (effectiveAddress === -1) {
			toast({
				variant: "destructive",
				title: "Błąd adresowania",
				description: "Nieprawidłowy format DISP lub błąd w obliczaniu adresu.",
			});
			return;
		}

		const selectedRegister =
			selectedReg.toLowerCase() as keyof typeof registers;

		if (direction === "toMemory") {
			// Przenoszenie wartości z rejestru do pamięci
			const value = registers[selectedRegister].value;
			dispatch(
				memorySlice.actions.writeToMemory({
					address: effectiveAddress,
					value,
					calculation: {
						addressCalculation: `${effectiveAddress.toString(16).toUpperCase()} (obliczony jako ${getAddressingString()})`,
						valueSource: `Wartość z rejestru ${selectedReg}: ${value}`,
					},
				}),
			);

			dispatch(
				addOperation({
					operation: "MOV",
					register: selectedReg,
					pointer: getAddressingString(),
					value: value,
					type: "MOV_TO_MEMORY",
				}),
			);
		} else {
			// Przenoszenie wartości z pamięci do rejestru
			const memoryValue = memory.cells[effectiveAddress];

			if (memoryValue === "00") {
				toast({
					variant: "destructive",
					title: "Błąd odczytu pamięci",
					description: `Pod adresem ${effectiveAddress.toString(16).toUpperCase()} nie znajduje się żadna wartość.`,
				});
				return;
			}

			dispatch(
				registersSlice.actions.writeFromMemory({
					register: selectedRegister,
					value: memoryValue,
				}),
			);

			dispatch(
				addOperation({
					operation: "MOV",
					register: selectedReg,
					pointer: getAddressingString(),
					value: memoryValue,
					type: "MOV_FROM_MEMORY",
				}),
			);
		}
	};

	/**
	 * Obsługa operacji XCHG między pamięcią a rejestrem
	 * Zamienia wartości między wybranym rejestrem a komórką pamięci
	 */
	const handleXCHG = () => {
		const effectiveAddress = calculateEffectiveAddress();
		if (effectiveAddress === -1) {
			toast({
				variant: "destructive",
				title: "Błąd adresowania",
				description: "Nieprawidłowy format DISP lub błąd w obliczaniu adresu.",
			});
			return;
		}

		const selectedRegister =
			selectedReg.toLowerCase() as keyof typeof registers;
		const regValue = registers[selectedRegister].value;
		const memValue = memory.cells[effectiveAddress];

		if (memValue === "00") {
			toast({
				variant: "destructive",
				title: "Błąd odczytu pamięci",
				description: `Pod adresem ${effectiveAddress.toString(16).toUpperCase()} nie znajduje się żadna wartość.`,
			});
			return;
		}

		// Zamiana wartości między rejestrem a pamięcią
		dispatch(
			memorySlice.actions.writeToMemory({
				address: effectiveAddress,
				value: regValue,
				calculation: {
					addressCalculation: `${effectiveAddress.toString(16).toUpperCase()} (obliczony jako ${getAddressingString()})`,
					valueSource: `Wymiana wartości z rejestrem ${selectedReg}: ${regValue}<->${memValue}`,
				},
			}),
		);

		dispatch(
			registersSlice.actions.writeFromMemory({
				register: selectedRegister,
				value: memValue,
			}),
		);

		dispatch(
			addOperation({
				operation: "XCHG",
				register: selectedReg,
				pointer: getAddressingString(),
				value: `${regValue}<->${memValue}`,
				type: "XCHG_MEMORY",
			}),
		);
	};

	// Reszta kodu komponentu (JSX) pozostaje bez zmian
	return (
		<Card>
			<CardHeader>
				<CardTitle>Operacje pamięci</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Kierunek operacji */}
					<div className="space-y-2">
						<Label>Kierunek operacji:</Label>
						<Select
							value={direction}
							onValueChange={(value) =>
								dispatch(setDirection(value as "toMemory" | "fromMemory"))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Wybierz kierunek" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="toMemory">Z rejestru do pamięci</SelectItem>
								<SelectItem value="fromMemory">
									Z pamięci do rejestru
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Tryb adresowania */}
					<div className="space-y-2">
						<Label>Tryb adresowania:</Label>
						<RadioGroup
							value={addressingMode}
							onValueChange={(value) => {
								dispatch(setAddressingMode(value as AddressingMode));
								dispatch(setSelectedBaseReg(""));
							}}
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="indexing" id="indexing" />
								<Label htmlFor="indexing">Indeksowy (SI/DI)</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="base" id="base" />
								<Label htmlFor="base">Bazowy (BX/BP)</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="index-base" id="index-base" />
								<Label htmlFor="index-base">Indeksowo-bazowy</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Wybór rejestrów */}
					<div className="space-y-4">
						{direction === "toMemory" ? (
							<div className="space-y-2">
								<Label>Wybierz rejestr źródłowy (dane do przeniesienia):</Label>
								<Select
									value={selectedReg}
									onValueChange={(value) => dispatch(setSelectedFromReg(value))}
								>
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
						) : (
							<div className="space-y-2">
								<Label>Wybierz rejestr docelowy (gdzie zapisać dane):</Label>
								<Select
									value={selectedReg}
									onValueChange={(value) => dispatch(setSelectedFromReg(value))}
								>
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
						)}

						<div className="space-y-2">
							<Label>
								Wybierz rejestr{addressingMode === "index-base" ? "y" : ""}{" "}
								adresujące{addressingMode === "index-base" ? "" : "y"}:
							</Label>
							<Select
								value={selectedBaseReg}
								onValueChange={(value) => dispatch(setSelectedBaseReg(value))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Wybierz sposób adresowania" />
								</SelectTrigger>
								<SelectContent>
									{getAvailableRegisters().map((reg) => (
										<SelectItem key={reg.value} value={reg.value}>
											{reg.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Przyciski operacji */}
					<div className="flex gap-2">
						<Button
							onClick={handleMOV}
							className="w-full"
							disabled={
								!selectedBaseReg || !isValidDisp(addressRegisters.disp.value)
							}
						>
							MOV
						</Button>
						<Button
							onClick={handleXCHG}
							className="w-full"
							disabled={
								!selectedBaseReg || !isValidDisp(addressRegisters.disp.value)
							}
						>
							XCHG
						</Button>
					</div>

					{/* Podgląd pamięci */}
					<div>
						<Label>Podgląd pamięci:</Label>
						<TooltipProvider>
							<div className="h-48 overflow-y-auto border rounded p-2">
								{memory.displayedCells.map((cell) => (
									<MemoryCell
										key={cell.address}
										address={cell.address}
										value={cell.value}
										calculation={cell.calculation}
									/>
								))}
							</div>
						</TooltipProvider>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
