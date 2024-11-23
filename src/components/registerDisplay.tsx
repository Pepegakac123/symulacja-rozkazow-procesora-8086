import type React from "react";
import type { RegisterDisplayProps } from "@/types";

const RegisterDisplay: React.FC<RegisterDisplayProps> = ({ registers }) => (
	<div className="grid grid-cols-4 gap-4 mb-6">
		{Object.entries(registers).map(([reg, value]) => (
			<div key={reg} className="text-center p-2 border rounded">
				<div className="font-bold">{reg}</div>
				<div className="font-mono">{value}</div>
			</div>
		))}
	</div>
);

export default RegisterDisplay;
