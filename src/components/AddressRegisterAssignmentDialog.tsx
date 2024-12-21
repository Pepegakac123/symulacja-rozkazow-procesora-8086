/**
 * Komponent AddressRegisterAssignmentDialog
 *
 * Dialog umożliwiający ręczne przypisywanie wartości do rejestrów adresowych:
 * - SI (Source Index)
 * - DI (Destination Index)
 * - BP (Base Pointer)
 * - DISP (Displacement)
 *
 * Zapewnia walidację wprowadzanych wartości i obsługę błędów.
 */
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
import { updateAddressRegister } from "../store/slices/addressRegistersSlice";
import { addOperation } from "../store/slices/operationsSlice";
import { useToast } from "@/hooks/use-toast";
import { isValidHexValue } from "../utils/validation";

const AddressRegisterAssignmentDialog = () => {
	// Inicjalizacja hooka dispatchera i systemu powiadomień
	const dispatch = useAppDispatch();
	const { toast } = useToast();

	// Pobieranie aktualnego stanu rejestrów z Redux store
	const addressRegisters = useAppSelector((state) => state.addressRegisters);

	/**
	 * Stan tymczasowych wartości w formularzu
	 * Używamy osobnego stanu, aby nie modyfikować głównego stanu rejestrów
	 * podczas wprowadzania danych
	 */
	const [tempValues, setTempValues] = React.useState({
		si: "",
		di: "",
		bp: "",
		disp: "",
	});

	// Stan kontrolujący widoczność dialogu
	const [open, setOpen] = React.useState(false);

	/**
	 * Obsługa zmiany wartości w polach input
	 * @param register - nazwa rejestru (si, di, bp, disp)
	 * @param value - wprowadzona wartość
	 */
	const handleInputChange = (register: string, value: string) => {
		setTempValues((prev) => ({
			...prev,
			[register]: value,
		}));
	};

	/**
	 * Walidacja i przypisanie wprowadzonych wartości do rejestrów
	 * Sprawdza:
	 * - Poprawność formatu liczb szesnastkowych
	 * - Długość wprowadzonych wartości (4 znaki)
	 * - Czy wprowadzono jakiekolwiek zmiany
	 */
	const validateAndAssign = () => {
		let isValid = true;
		let hasChanges = false;

		// Sprawdzenie każdej wprowadzonej wartości
		// biome-ignore lint/complexity/noForEach: wymagane dla zachowania kolejności walidacji
		Object.entries(tempValues).forEach(([register, value]) => {
			if (value !== "") {
				// Sprawdzenie czy wartość jest poprawną 4-cyfrową liczbą szesnastkową
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

		// Przerwanie jeśli dane są niepoprawne
		if (!isValid) return;

		// Sprawdzenie czy wprowadzono jakiekolwiek zmiany
		if (!hasChanges) {
			toast({
				variant: "destructive",
				title: "Brak zmian",
				description: "Nie wprowadzono żadnych nowych wartości.",
			});
			return;
		}

		// Przypisanie zatwierdzonych wartości do rejestrów
		// biome-ignore lint/complexity/noForEach: wymagane dla zachowania kolejności aktualizacji
		Object.entries(tempValues).forEach(([register, value]) => {
			if (value !== "") {
				// Aktualizacja wartości w rejestrze
				dispatch(
					updateAddressRegister({
						register: register as keyof typeof addressRegisters,
						value: value.toUpperCase(),
					}),
				);

				// Dodanie operacji do historii
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

		// Reset formularza i zamknięcie dialogu
		setTempValues({
			si: "",
			di: "",
			bp: "",
			disp: "",
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* Przycisk otwierający dialog */}
			<DialogTrigger asChild>
				<Button className="w-full">PRZYPISZ</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Przypisz wartości do rejestrów adresowych</DialogTitle>
				</DialogHeader>
				{/* Formularz z polami dla każdego rejestru */}
				<div className="grid gap-4 py-4">
					{Object.entries(addressRegisters).map(([reg, { label }]) => (
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
								maxLength={4} // Ograniczenie długości wpisu do 4 znaków
							/>
						</div>
					))}
				</div>
				{/* Przycisk zatwierdzający wprowadzone wartości */}
				<Button onClick={validateAndAssign}>Przypisz wartości</Button>
			</DialogContent>
		</Dialog>
	);
};

export default AddressRegisterAssignmentDialog;
