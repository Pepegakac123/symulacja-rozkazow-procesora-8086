/**
 * Slice rejestrów adresowych
 * Zarządza stanem rejestrów SI, DI, BP i DISP
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddressRegisters } from "../../types";

/**
 * Generuje losową 4-cyfrową liczbę szesnastkową
 * Używane do funkcji RANDOM dla rejestrów
 * @returns string - 4-cyfrowa liczba szesnastkowa (np. "12AB")
 */
const generateRandomHex = () => {
	return Array(4)
		.fill(0)
		.map(() => Math.floor(Math.random() * 16).toString(16))
		.join("")
		.toUpperCase();
};

/**
 * Generuje losowe wartości dla wszystkich rejestrów adresowych
 * @returns obiekt z losowymi wartościami dla SI, DI, BP i DISP
 */
export const generateRandomAddressValues = () => {
	return {
		si: generateRandomHex(),
		di: generateRandomHex(),
		bp: generateRandomHex(),
		disp: generateRandomHex(),
	};
};

/**
 * Stan początkowy rejestrów adresowych
 * Wszystkie rejestry zaczynają z wartością "0000"
 */
const initialState: AddressRegisters = {
	si: { value: "0000", label: "SI" },
	di: { value: "0000", label: "DI" },
	bp: { value: "0000", label: "BP" },
	disp: { value: "0000", label: "DISP" },
};

/**
 * Slice rejestrów adresowych z wszystkimi reducerami
 */
export const addressRegistersSlice = createSlice({
	name: "addressRegisters",
	initialState,
	reducers: {
		/**
		 * Aktualizuje wartość pojedynczego rejestru adresowego
		 * @param state - aktualny stan rejestrów
		 * @param action - zawiera nazwę rejestru i nową wartość
		 */
		updateAddressRegister: (
			state,
			action: PayloadAction<{
				register: keyof AddressRegisters;
				value: string;
			}>,
		) => {
			const { register, value } = action.payload;
			state[register].value = value.toUpperCase();
		},

		/**
		 * Resetuje wszystkie rejestry do wartości początkowych ("0000")
		 */
		resetAddressRegisters: () => initialState,

		/**
		 * Ustawia losowe wartości dla wszystkich rejestrów
		 * @param state - aktualny stan rejestrów
		 * @param action - zawiera obiekt z nowymi wartościami
		 */
		setRandomAddressValues: (
			state,
			action: PayloadAction<ReturnType<typeof generateRandomAddressValues>>,
		) => {
			const randomValues = action.payload;
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.keys(randomValues).forEach((reg) => {
				state[reg as keyof AddressRegisters].value =
					randomValues[reg as keyof typeof randomValues];
			});
		},
	},
});

// Eksport akcji do użycia w komponentach
export const {
	updateAddressRegister,
	resetAddressRegisters,
	setRandomAddressValues,
} = addressRegistersSlice.actions;
