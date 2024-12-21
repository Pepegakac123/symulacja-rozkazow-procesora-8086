/**
 * Slice zarządzający pamięcią procesora
 * Obsługuje 65536 komórek pamięci (16-bitowe adresowanie)
 * oraz wyświetlane komórki ze szczegółami adresowania
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Memory } from "@/types";

/**
 * Stan początkowy pamięci:
 * - cells: tablica 65536 komórek, każda z wartością "00"
 * - displayedCells: lista wyświetlanych komórek ze szczegółami dostępu
 */
const initialMemory: Memory = {
	cells: Array(65536).fill("00"), // Każda komórka inicjowana jako "00"
	displayedCells: [], // Lista komórek do wyświetlenia w interfejsie
};

export const memorySlice = createSlice({
	name: "memory",
	initialState: initialMemory,
	reducers: {
		/**
		 * Zapisuje wartość do komórki pamięci
		 * @param state - aktualny stan pamięci
		 * @param action - zawiera:
		 *   - address: adres komórki (0-65535)
		 *   - value: wartość do zapisania
		 *   - calculation: opcjonalne szczegóły obliczenia adresu i źródła wartości
		 */
		writeToMemory: (
			state,
			action: PayloadAction<{
				address: number;
				value: string;
				calculation?: {
					addressCalculation: string; // Szczegóły obliczenia adresu
					valueSource: string; // Źródło zapisywanej wartości
				};
			}>,
		) => {
			const { address, value, calculation } = action.payload;

			// Zapisanie wartości w głównej tablicy pamięci
			state.cells[address] = value;

			// Usunięcie poprzedniego wpisu dla tego samego adresu
			state.displayedCells = state.displayedCells.filter(
				(cell) => cell.address !== address,
			);

			// Dodanie nowego wpisu na początek listy wyświetlanych komórek
			state.displayedCells.unshift({
				address,
				value,
				calculation,
			});

			// Filtrowanie tylko komórek z niezerowymi wartościami
			state.displayedCells = state.displayedCells.filter(
				(cell) => cell.value !== "00",
			);
		},

		/**
		 * Resetuje pamięć do stanu początkowego
		 * Czyści wszystkie komórki i historię wyświetlanych komórek
		 */
		resetMemory: () => initialMemory,
	},
});
