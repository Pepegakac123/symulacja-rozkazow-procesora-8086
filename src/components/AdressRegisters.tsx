/**
 * Komponent AddressRegisters
 *
 * Implementuje funkcjonalność rejestrów adresowych procesora Intel 8086:
 * - SI (Source Index) - rejestr indeksu źródłowego
 * - DI (Destination Index) - rejestr indeksu docelowego
 * - BP (Base Pointer) - wskaźnik bazowy
 * - DISP (Displacement) - przesunięcie
 *
 * Umożliwia:
 * - Podgląd aktualnych wartości rejestrów
 * - Przypisywanie wartości przez dialog
 * - Generowanie losowych wartości
 * - Resetowanie wartości do stanu początkowego
 */
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
	// Inicjalizacja dispatchera Redux
	const dispatch = useAppDispatch();

	// Pobieranie stanu rejestrów adresowych z Redux store
	const addressRegisters = useAppSelector((state) => state.addressRegisters);

	/**
	 * Obsługa generowania losowych wartości dla wszystkich rejestrów adresowych
	 * Generuje 4-cyfrowe liczby szesnastkowe i aktualizuje stan w Redux
	 */
	const handleRandom = () => {
		// Generowanie nowych losowych wartości
		const randomValues = generateRandomAddressValues();
		// Aktualizacja wartości w store
		dispatch(setRandomAddressValues(randomValues));

		// Zapisanie każdej zmiany w historii operacji
		// biome-ignore lint/complexity/noForEach: wymagane dla zachowania kolejności operacji
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
	 * Obsługa resetowania wszystkich rejestrów adresowych do wartości "0000"
	 * Aktualizuje stan w Redux i dodaje informacje o resecie do historii operacji
	 */
	const handleReset = () => {
		// Reset wartości rejestrów
		dispatch(resetAddressRegisters());

		// Zapisanie operacji resetu dla każdego rejestru w historii
		// biome-ignore lint/complexity/noForEach: wymagane dla zachowania kolejności operacji
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
					{/* Wyświetlanie wszystkich rejestrów adresowych */}
					{Object.entries(addressRegisters).map(([reg, { value, label }]) => (
						<div key={reg} className="mb-4">
							<Label>{label}</Label>
							{/* Pole tylko do odczytu wyświetlające wartość rejestru */}
							<Input value={value} readOnly className="font-mono bg-gray-50" />
						</div>
					))}

					<div className="flex flex-col gap-2">
						{/* Dialog do ręcznego przypisywania wartości */}
						<AddressRegisterAssignmentDialog />

						{/* Przyciski operacji na rejestrach */}
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
