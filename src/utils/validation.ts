/**
 * Moduł zawierający funkcje pomocnicze do walidacji danych w symulatorze
 */

/**
 * Sprawdza czy podana wartość jest poprawną liczbą szesnastkową o długości do 4 znaków
 *
 * @param value - string do sprawdzenia
 * @returns boolean - true jeśli wartość jest poprawną liczbą szesnastkową, false w przeciwnym razie
 *
 * Funkcja sprawdza:
 * - Czy wszystkie znaki są cyframi szesnastkowymi (0-9, A-F, a-f)
 * - Czy długość nie przekracza 4 znaków (maksymalna długość wartości w rejestrze)
 *
 * @example
 * isValidHexValue("12AB") // true
 * isValidHexValue("WXYZ") // false
 * isValidHexValue("12345") // false
 */
export const isValidHexValue = (value: string): boolean => {
	return /^[0-9A-Fa-f]*$/.test(value) && value.length <= 4;
};

/**
 * Formatuje wartość szesnastkową do standardowego formatu
 *
 * @param value - string z wartością szesnastkową
 * @returns string - sformatowana wartość szesnastkowa
 *
 * Funkcja:
 * - Uzupełnia wartość zerami z przodu do długości 4 znaków
 * - Konwertuje wszystkie znaki na wielkie litery
 *
 * @example
 * formatHexValue("1ab") // "01AB"
 * formatHexValue("12") // "0012"
 */
export const formatHexValue = (value: string): string => {
	return value.padStart(4, "0").toUpperCase();
};
