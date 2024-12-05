import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearOperations } from "../store/slices/operationsSlice";

export const OperationHistory: React.FC = () => {
	const dispatch = useAppDispatch();
	const operations = useAppSelector((state) => state.operations.operations);

	const handleClear = () => {
		dispatch(clearOperations());
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
							{operation.command}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
