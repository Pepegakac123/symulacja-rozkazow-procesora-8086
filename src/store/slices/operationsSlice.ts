/**
 * Slice zarządzający historią wykonanych operacji
 * Przechowuje chronologiczną listę wszystkich operacji procesora
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Operation } from "../../types";

/**
 * Interfejs stanu historii operacji
 * Zawiera tablicę wykonanych operacji
 */
interface OperationsState {
	operations: Operation[];
}

/**
 * Stan początkowy - pusta lista operacji
 */
const initialState: OperationsState = {
	operations: [],
};

/**
 * Slice historii operacji
 * Obsługuje dodawanie nowych operacji i czyszczenie historii
 */
export const operationsSlice = createSlice({
	name: "operations",
	initialState,
	reducers: {
		/**
		 * Dodaje nową operację na początek historii
		 * @param state - aktualny stan historii
		 * @param action - szczegóły operacji bez id i timestamp
		 *
		 * Typy operacji:
		 * - RANDOM: generowanie losowych wartości
		 * - PRZYPISZ: ręczne przypisanie wartości
		 * - RESET: resetowanie do wartości początkowych
		 * - MOV: przeniesienie wartości między rejestrami
		 * - XCHG: zamiana wartości między rejestrami
		 * - MOV_TO_MEMORY: zapis do pamięci
		 * - MOV_FROM_MEMORY: odczyt z pamięci
		 * - XCHG_MEMORY: zamiana z pamięcią
		 * - STACK: operacje PUSH/POP
		 */
		addOperation: (
			state,
			action: PayloadAction<Omit<Operation, "id" | "timestamp">>,
		) => {
			state.operations.unshift({
				id: uuidv4(), // Generowanie unikalnego ID dla operacji
				timestamp: Date.now(), // Dodanie znacznika czasu
				...action.payload,
			});
		},

		/**
		 * Czyści całą historię operacji
		 * Przywraca stan początkowy (pusta lista)
		 */
		clearOperations: () => initialState,
	},
});

// Eksport akcji do użycia w komponentach
export const { addOperation, clearOperations } = operationsSlice.actions;
