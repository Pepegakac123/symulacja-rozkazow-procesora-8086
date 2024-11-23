import type React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { RegisterSelectorProps, Register } from "@/types/";

const RegisterSelector: React.FC<RegisterSelectorProps> = ({
	value,
	onChange,
	placeholder,
	disabled,
}) => (
	<Select value={value} onValueChange={onChange} disabled={disabled}>
		<SelectTrigger className="w-[180px]">
			<SelectValue placeholder={placeholder} />
		</SelectTrigger>
		<SelectContent>
			{["AX", "BX", "CX", "DX"].map((reg) => (
				<SelectItem key={reg} value={reg as Register}>
					{reg}
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);

export default RegisterSelector;
