import type React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { OperationSelectorProps } from "@/types/";

const OperationSelector: React.FC<OperationSelectorProps> = ({
	selectedOperation,
	onOperationChange,
}) => (
	<Select value={selectedOperation} onValueChange={onOperationChange}>
		<SelectTrigger className="w-[180px]">
			<SelectValue placeholder="Wybierz operację" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="MOV">MOV</SelectItem>
			<SelectItem value="XCHG">XCHG</SelectItem>
		</SelectContent>
	</Select>
);

export default OperationSelector;
