/**
 * Komponent OperationHistory
 *
 * Wyświetla historię wszystkich wykonanych operacji na procesorze.
 * Pokazuje chronologicznie (od najnowszej) listę operacji takich jak:
 * - MOV (przenoszenie wartości)
 * - XCHG (zamiana wartości)
 * - Operacje na stosie (PUSH/POP)
 * - Operacje na pamięci
 * - Operacje przypisania i generowania losowych wartości
 */
import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearOperations } from "../store/slices/operationsSlice";
import type { Operation } from "@/types";

export const OperationHistory: React.FC = () => {
	const dispatch = useAppDispatch();
	// Pobieranie listy operacji z Redux store
	const operations = useAppSelector((state) => state.operations.operations);

	/**
	 * Obsługa czyszczenia historii operacji
	 */
	const handleClear = () => {
		dispatch(clearOperations());
	};

	/**
	 * Formatowanie pojedynczej operacji do wyświetlenia
	 * Dostosowuje format wyświetlania w zależności od typu operacji
	 *
	 * @param op - obiekt operacji zawierający szczegóły wykonanej akcji
	 * @returns sformatowany string reprezentujący operację
	 */
	const formatOperation = (op: Operation): string => {
		switch (op.type) {
			// Operacje przypisania losowych wartości
			case "RANDOM":
				// Format: MOV REJESTR, WARTOŚĆ                     RANDOM
				return `${op.operation} ${op.register}, ${op.value}                     ${op.type}`;

			// Operacje ręcznego przypisania wartości
			case "PRZYPISZ":
				// Format: MOV REJESTR, WARTOŚĆ                     PRZYPISZ
				return `${op.operation} ${op.register}, ${op.value}                     ${op.type}`;

			// Operacje resetowania wartości rejestrów
			case "RESET":
				// Format: MOV REJESTR, 0000                     RESET
				return `${op.operation} ${op.register}, ${op.value}                     ${op.type}`;

			// Operacje przenoszenia wartości między rejestrami
			case "MOV":
				// Format: MOV REJESTR_DOCELOWY, REJESTR_ŹRÓDŁOWY                     MOV
				return `${op.operation} ${op.register}, ${op.secondRegister}                     ${op.type}`;

			// Operacje zamiany wartości między rejestrami
			case "XCHG":
				// Format: XCHG REJESTR1, REJESTR2                    XCHG
				return `${op.operation} ${op.register}, ${op.secondRegister}                    ${op.type}`;

			// Operacje zapisu do pamięci
			case "MOV_TO_MEMORY":
				// Format: MOV [ADRES], REJESTR                      MOV
				return `${op.operation} [${op.pointer}], ${op.register}                      MOV`;

			// Operacje odczytu z pamięci
			case "MOV_FROM_MEMORY":
				// Format: MOV REJESTR, [ADRES]                      MOV
				return `${op.operation} ${op.register}, [${op.pointer}]                      MOV`;

			// Operacje zamiany wartości z pamięcią
			case "XCHG_MEMORY":
				// Format: XCHG REJESTR, [ADRES]                      XCHG
				return `${op.operation} ${op.register}, [${op.pointer}]                      XCHG`;

			// Operacje na stosie (PUSH/POP)
			case "STACK":
				// Format: OPERACJA REJESTR                                  STACK
				return `${op.operation} ${op.register}                                  STACK`;

			// Domyślna obsługa nieznanych typów operacji
			default:
				return "";
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Historia operacji</CardTitle>
				{/* Przycisk czyszczenia historii */}
				<Button variant="outline" size="sm" onClick={handleClear}>
					Wyczyść
				</Button>
			</CardHeader>
			<CardContent>
				{/* Lista wszystkich operacji w formacie monospace dla lepszej czytelności */}
				<div className="h-48 overflow-y-auto border rounded p-2">
					{operations.map((operation) => (
						<div key={operation.id} className="text-sm font-mono">
							{formatOperation(operation)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
