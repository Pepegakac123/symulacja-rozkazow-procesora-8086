/**
 * Slice zarządzający stanem interfejsu użytkownika
 * Przechowuje informacje o:
 * - Wybranych rejestrach do operacji
 * - Aktualnym trybie adresowania
 * - Kierunku operacji pamięciowych
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddressingMode, OperationDirection } from "@/types";

/**
 * Interfejs stanu UI
 * @property selectedFromReg - aktualnie wybrany rejestr źródłowy
 * @property selectedToReg - aktualnie wybrany rejestr docelowy
 * @property addressingMode - wybrany tryb adresowania pamięci
 * @property direction - kierunek operacji pamięciowej
 * @property selectedBaseReg - wybrany rejestr bazowy
 */
interface UIState {
	selectedFromReg: string;
	selectedToReg: string;
	addressingMode: AddressingMode;
	direction: OperationDirection;
	selectedBaseReg: string;
}

/**
 * Stan początkowy interfejsu
 * - Domyślnie wybrane rejestry AX i BX
 * - Tryb adresowania indeksowy
 * - Kierunek operacji: do pamięci
 * - Brak wybranego rejestru bazowego
 */
const initialState: UIState = {
	selectedFromReg: "AX",
	selectedToReg: "BX",
	addressingMode: "indexing",
	direction: "toMemory",
	selectedBaseReg: "",
};

/**
 * Slice UI z definicją wszystkich dostępnych akcji
 */
export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		/**
		 * Ustawia wybrany rejestr źródłowy
		 * Używane przy wyborze rejestru do operacji MOV, XCHG, PUSH
		 *
		 * @param state Aktualny stan UI
		 * @param action Nazwa wybranego rejestru (np. "AX")
		 */
		setSelectedFromReg: (state, action: PayloadAction<string>) => {
			state.selectedFromReg = action.payload;
		},

		/**
		 * Ustawia wybrany rejestr docelowy
		 * Używane przy wyborze rejestru do operacji MOV, XCHG, POP
		 *
		 * @param state Aktualny stan UI
		 * @param action Nazwa wybranego rejestru (np. "BX")
		 */
		setSelectedToReg: (state, action: PayloadAction<string>) => {
			state.selectedToReg = action.payload;
		},

		/**
		 * Ustawia tryb adresowania pamięci
		 * Dostępne tryby:
		 * - "indexing" (indeksowy - SI/DI)
		 * - "base" (bazowy - BX/BP)
		 * - "index-base" (indeksowo-bazowy)
		 *
		 * @param state Aktualny stan UI
		 * @param action Wybrany tryb adresowania
		 */
		setAddressingMode: (state, action: PayloadAction<AddressingMode>) => {
			state.addressingMode = action.payload;
		},

		/**
		 * Ustawia kierunek operacji pamięciowej
		 * Dostępne kierunki:
		 * - "toMemory" (z rejestru do pamięci)
		 * - "fromMemory" (z pamięci do rejestru)
		 *
		 * @param state Aktualny stan UI
		 * @param action Wybrany kierunek operacji
		 */
		setDirection: (state, action: PayloadAction<OperationDirection>) => {
			state.direction = action.payload;
		},

		/**
		 * Ustawia wybrany rejestr bazowy dla adresowania
		 * Używane w trybach adresowania bazowego i indeksowo-bazowego
		 *
		 * @param state Aktualny stan UI
		 * @param action Nazwa wybranego rejestru bazowego
		 */
		setSelectedBaseReg: (state, action: PayloadAction<string>) => {
			state.selectedBaseReg = action.payload;
		},
	},
});

// Eksport akcji do użycia w komponentach
export const {
	setSelectedFromReg,
	setSelectedToReg,
	setAddressingMode,
	setDirection,
	setSelectedBaseReg,
} = uiSlice.actions;
