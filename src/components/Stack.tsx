import type React from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const Stack: React.FC = () => {
	const dispatch = useAppDispatch();
	const stack = useAppSelector((state) => state.stack);
	const selectedReg = useAppSelector((state) => state.ui.selectedFromReg);

	const handlePush = () => {
		dispatch({ type: "stack/push", payload: selectedReg });
	};

	const handlePop = () => {
		dispatch({ type: "stack/pop", payload: selectedReg });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Stos</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<Select value={selectedReg}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="AX">AX</SelectItem>
								<SelectItem value="BX">BX</SelectItem>
								<SelectItem value="CX">CX</SelectItem>
								<SelectItem value="DX">DX</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-2">
						<Button onClick={handlePush}>PUSH</Button>
						<Button onClick={handlePop}>POP</Button>
					</div>

					<div>SP: {stack.pointer}</div>

					<div className="h-32 overflow-y-auto border rounded p-2">
						{stack.values.map((value, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div key={index} className="text-sm font-mono">
								{index}: {value}
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
