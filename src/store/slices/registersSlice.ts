/**
 * Slice zarządzający głównymi rejestrami procesora (AX, BX, CX, DX)
 * Implementuje operacje:
 * - Aktualizacja wartości rejestrów
 * - Generowanie losowych wartości
 * - Resetowanie do stanu początkowego
 * - Operacje MOV i XCHG między rejestrami
 * - Operacje z pamięcią
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Registers } from "@/types";

/**
 * Funkcja generująca losową 4-cyfrową liczbę szesnastkową
 * Używana w operacji RANDOM dla rejestrów
 *
 * Proces generowania:
 * 1. Tworzy tablicę 4 elementów
 * 2. Dla każdej pozycji generuje losową cyfrę szesnastkową (0-F)
 * 3. Łączy cyfry w string i konwertuje na wielkie litery
 *
 * @returns string Czteroznakowy string reprezentujący liczbę szesnastkową (np. "1A2B")
 */
const generateRandomHex = () => {
	return Array(4)
		.fill(0)
		.map(() => Math.floor(Math.random() * 16).toString(16))
		.join("")
		.toUpperCase();
};

/**
 * Funkcja generująca losowe wartości dla wszystkich rejestrów głównych
 * Używana w operacji RANDOM dla całego zestawu rejestrów
 *
 * @returns obiekt z losowymi wartościami dla każdego rejestru
 * @example
 * {
 *   ax: "1234",
 *   bx: "5678",
 *   cx: "9ABC",
 *   dx: "DEF0"
 * }
 */
export const generateRandomValues = () => {
	return {
		ax: generateRandomHex(),
		bx: generateRandomHex(),
		cx: generateRandomHex(),
		dx: generateRandomHex(),
	};
};

/**
 * Stan początkowy rejestrów głównych
 * Każdy rejestr zawiera:
 * - value: wartość w formacie szesnastkowym (początkowo "0000")
 * - label: etykieta rejestru (AX, BX, CX, DX)
 */
const initialRegisters: Registers = {
	ax: { value: "0000", label: "AX" },
	bx: { value: "0000", label: "BX" },
	cx: { value: "0000", label: "CX" },
	dx: { value: "0000", label: "DX" },
};

/**
 * Slice rejestrów głównych z definicją wszystkich dostępnych akcji
 */
export const registersSlice = createSlice({
	name: "registers",
	initialState: initialRegisters,
	reducers: {
		/**
		 * Aktualizuje wartość pojedynczego rejestru
		 * Używane przy ręcznym przypisywaniu wartości
		 *
		 * @param state Aktualny stan rejestrów
		 * @param action Payload zawiera:
		 *   - register: nazwa rejestru do aktualizacji (ax, bx, cx, dx)
		 *   - value: nowa wartość w formacie szesnastkowym
		 */
		updateRegister: (
			state,
			action: PayloadAction<{ register: keyof Registers; value: string }>,
		) => {
			const { register, value } = action.payload;
			state[register].value = value.toUpperCase();
		},

		/**
		 * Resetuje wszystkie rejestry do stanu początkowego
		 * Ustawia wartość "0000" dla każdego rejestru
		 */
		resetRegisters: () => initialRegisters,

		/**
		 * Ustawia losowe wartości dla wszystkich rejestrów
		 * Używane w operacji RANDOM
		 *
		 * @param state Aktualny stan rejestrów
		 * @param action Payload zawiera obiekt z nowymi losowymi wartościami
		 */
		setRandomValues: (
			state,
			action: PayloadAction<ReturnType<typeof generateRandomValues>>,
		) => {
			const randomValues = action.payload;
			// biome-ignore lint/complexity/noForEach: wymagane dla zachowania kolejności aktualizacji
			Object.keys(randomValues).forEach((reg) => {
				state[reg as keyof Registers].value =
					randomValues[reg as keyof typeof randomValues];
			});
		},

		/**
		 * Wykonuje operację MOV między rejestrami
		 * Kopiuje wartość z rejestru źródłowego do docelowego
		 *
		 * @param state Aktualny stan rejestrów
		 * @param action Payload zawiera:
		 *   - from: rejestr źródłowy
		 *   - to: rejestr docelowy
		 * @example MOV AX, BX (kopiuje wartość z BX do AX)
		 */
		movRegisterToRegister: (
			state,
			action: PayloadAction<{ from: keyof Registers; to: keyof Registers }>,
		) => {
			const { from, to } = action.payload;
			state[to].value = state[from].value;
		},

		/**
		 * Wykonuje operację XCHG między rejestrami
		 * Zamienia wartości między dwoma rejestrami
		 *
		 * @param state Aktualny stan rejestrów
		 * @param action Payload zawiera:
		 *   - first: pierwszy rejestr do zamiany
		 *   - second: drugi rejestr do zamiany
		 * @example XCHG AX, BX (zamienia wartości między AX i BX)
		 */
		xchgRegisters: (
			state,
			action: PayloadAction<{
				first: keyof Registers;
				second: keyof Registers;
			}>,
		) => {
			const { first, second } = action.payload;
			const temp = state[first].value;
			state[first].value = state[second].value;
			state[second].value = temp;
		},

		/**
		 * Zapisuje wartość z pamięci do rejestru
		 * Używane w operacjach odczytu z pamięci
		 *
		 * @param state Aktualny stan rejestrów
		 * @param action Payload zawiera:
		 *   - register: rejestr docelowy
		 *   - value: wartość odczytana z pamięci
		 */
		writeFromMemory: (
			state,
			action: PayloadAction<{ register: keyof Registers; value: string }>,
		) => {
			const { register, value } = action.payload;
			state[register].value = value;
		},
	},
});

// Eksport akcji do użycia w komponentach
export const {
	updateRegister,
	resetRegisters,
	setRandomValues,
	movRegisterToRegister,
	xchgRegisters,
	writeFromMemory,
} = registersSlice.actions;
