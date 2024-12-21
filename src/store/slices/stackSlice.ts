/**
 * Slice zarządzający stosem procesora Intel 8086
 * Implementuje operacje:
 * - PUSH (odkładanie wartości na stos)
 * - POP (zdejmowanie wartości ze stosu)
 * - Zarządzanie wskaźnikiem stosu (SP - Stack Pointer)
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stack } from "../../types";

/**
 * Stan początkowy stosu
 * @property values - tablica przechowująca wartości na stosie (od szczytu)
 * @property pointer - wskaźnik stosu (SP), początkowo wskazuje na 65534 (szczyt stosu)
 *
 * WAŻNE: Stos rośnie w dół pamięci, więc SP jest zmniejszany przy PUSH i zwiększany przy POP
 * Każda wartość na stosie zajmuje 2 bajty (słowo), stąd SP zmienia się o 2 przy każdej operacji
 */
const initialState: Stack = {
	values: [], // Pusta tablica wartości
	pointer: 65534, // Początkowa wartość SP (szczyt stosu)
};

/**
 * Slice stosu z definicją wszystkich dostępnych akcji
 */
export const stackSlice = createSlice({
	name: "stack",
	initialState,
	reducers: {
		/**
		 * Operacja PUSH - odkłada wartość na szczyt stosu
		 * 1. Dodaje wartość na początek tablicy values (szczyt stosu)
		 * 2. Zmniejsza SP o 2 (stos rośnie w dół)
		 *
		 * @param state Aktualny stan stosu
		 * @param action Wartość do odłożenia na stos (wartość z rejestru)
		 */
		push: (state, action: PayloadAction<string>) => {
			const registerValue = action.payload;
			state.values.unshift(registerValue); // Dodanie na szczyt stosu
			state.pointer -= 2; // Zmniejszenie SP
		},

		/**
		 * Operacja POP - zdejmuje wartość ze szczytu stosu
		 * 1. Usuwa pierwszą wartość z tablicy values
		 * 2. Zwiększa SP o 2 (stos maleje)
		 *
		 * @param state Aktualny stan stosu
		 * Operacja jest wykonywana tylko gdy stos nie jest pusty
		 */
		pop: (state) => {
			if (state.values.length > 0) {
				state.values.shift(); // Usunięcie ze szczytu stosu
				state.pointer += 2; // Zwiększenie SP
			}
		},

		/**
		 * Resetuje stos do stanu początkowego:
		 * - Czyści wszystkie wartości
		 * - Przywraca początkową wartość SP (65534)
		 */
		resetStack: () => initialState,
	},
});

// Eksport akcji do użycia w komponentach
export const { push, pop, resetStack } = stackSlice.actions;
