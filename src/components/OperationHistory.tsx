import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearOperations } from "../store/slices/operationsSlice";
import type { Operation } from "@/types";

export const OperationHistory: React.FC = () => {
	const dispatch = useAppDispatch();
	const operations = useAppSelector((state) => state.operations.operations);

	const handleClear = () => {
		dispatch(clearOperations());
	};

	const formatOperation = (op: Operation): string => {
		switch (op.type) {
			case "RANDOM":
				return `${op.operation} ${op.register}, ${op.value}                     ${op.type}`;
			case "PRZYPISZ":
				return `${op.operation} ${op.register}, ${op.value}                     ${op.type}`;
			case "RESET":
				return `${op.operation} ${op.register}, ${op.value}                     ${op.type}`;
			case "MOV_TO_MEMORY":
				return `${op.operation} [${op.pointer}], ${op.register}                      MOV`;
			case "MOV_FROM_MEMORY":
				return `${op.operation} ${op.register}, [${op.pointer}]                      MOV`;
			case "XCHG_MEMORY":
				return `${op.operation} ${op.register}, [${op.pointer}]                      XCHG`;
			case "MOV":
				return `${op.operation} ${op.register}, ${op.secondRegister}                      MOV`;
			case "XCHG":
				return `${op.operation} ${op.register}, ${op.secondRegister}                      XCHG`;
			default:
				return "";
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Historia operacji</CardTitle>
				<Button variant="outline" size="sm" onClick={handleClear}>
					Wyczyść
				</Button>
			</CardHeader>
			<CardContent>
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
